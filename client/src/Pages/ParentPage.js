import React, {Component} from 'react';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import {Container} from 'react-bootstrap';
import Header from './../Components/Header';
import GenerateData from './../Pages/GenerateData';
import SetProperties from './../Pages/SetProperties';
import AnalyzeData from './../Pages/AnalyzeData';
import MatCard from './../Components/MatCard/MatCard';
import './../App.css';
import axios from "axios";
import io from 'socket.io-client';
import ss from 'socket.io-stream';

class ParentPage extends Component {
    constructor() {
        super();
        this.state = {
            currentView: '',
            runButtonPhrase: '',
            runButtonActivated: false,
            genConsoleOpen: false,
            genConsole: '',
            generatingData: false,
            settings: [],
            numGeantSpots: 4,
            genListSingle: [],
            genListMulti: [],
            configs: [],
            defaultMat: {name: 'Galactic', installed: true, color: '#000000'},
            genSocket: io('http://10.103.72.187:5001'),
            analyzerSocket: io('http://10.103.72.187:5002'),
            analysisData: {
                eIn: [],
                eDes: [],
                eOut: [],
                weights: {accuracy: 1, weight: 0, size: 0, cost: 0},
                curMats: [{mat: 'tin', color: 'blue1', length: 10},
                    {mat: 'moly', color: 'blue3', length: 10},
                    {mat: 'bh303', color: 'blue5', length: 10},
                    {mat: 'graphite', color: 'blue7', length: 10},],
                curDiff: Infinity,
                matDict: {},
                matsAvail: [],
                matsAvailNames: [],
                iteration: 0,
                algorithm: '',
                weightsChanged: false,
                running: true,
            },
            analysisConsole: '',
            analyzerProgress: 0,
            currentAnalyzer: 0,
        };
        this.changeSettings = this.changeSettings.bind(this);
        this.initSettings = this.initSettings.bind(this);
        this.printProps = this.printProps.bind(this);
        this.changeButtonPhrase = this.changeButtonPhrase.bind(this);
        this.changeButtonState = this.changeButtonState.bind(this);
        this.generateData = this.generateData.bind(this);
        this.runAnalysis = this.runAnalysis.bind(this);
        this.updateGenList = this.updateGenList.bind(this);
        this.genListRemove = this.genListRemove.bind(this);
        this.closeGenConsole = this.closeGenConsole.bind(this);
        this.uploadConfig = this.uploadConfig.bind(this);
        this.updateInput = this.updateInput.bind(this);
        this.changeWeights = this.changeWeights.bind(this);

    }

    updateInput(e, target) {
        let tempArr;
        switch (target) {
            case 'eIn':
                tempArr = this.state.analysisData.eIn.slice();
                tempArr[Number(e.target.id)] = Number(e.target.value);
                this.setState(state => (state.analysisData.eIn = tempArr, state));
                break;
            case 'eDes':
                tempArr = this.state.analysisData.eDes.slice();
                tempArr[Number(e.target.id)] = Number(e.target.value);
                this.setState(state => (state.analysisData.eDes = tempArr, state));
                break;
            default:
                break;
        }
    }

    changeWeights(e, weights) {
        this.setState(state => (state.analysisData.weights = weights, state));
    }


    closeGenConsole() {
        this.setState({genConsoleOpen: false});
    }

    updateGenList(index, mat, len) {
        console.log('updating: ', index, mat, len);
        let temp = this.state.genListSingle.slice(0, this.state.numGeantSpots);
        let tempLen = len ? len : {single: true, min: 10, max: 100, part: 30};
        temp[index] = {
            mat: mat,
            len: tempLen,
            html: <li className='mx-1 my-1 list-unstyled d-flex align-items-stretch' key={index}><MatCard
                mat={mat} indx={index} len={tempLen} mode='entry' updateGenList={this.updateGenList}
                genListRemove={this.genListRemove}/>
            </li>
        };
        console.log('updated add: ', temp);
        this.setState({genListSingle: temp});
    }

    genListRemove(index) {
        let temp = this.state.genListSingle.slice();
        temp[index] = {
            mat: {name: 'Galactic', color: '#000000', installed: true},
            len: {single: true, min: 10, max: 100, part: 30},
            html: <li className='mx-1 my-1 list-unstyled d-flex align-items-stretch' key={index}><MatCard
                mat={{name: 'Galactic', color: '#000000', installed: true}} indx={index}
                len={{single: true, min: 10, max: 100, part: 30}} mode='entry' updateGenList={this.updateGenList}
                genListRemove={this.genListRemove}/>
            </li>
        };
        console.log('updated remove: ', temp, index);
        this.setState({genListSingle: temp});
    }

    uploadConfig(config) {
        return axios.post(`http://10.103.72.187:5000/api/v1/config/new`, config)
            .then(res => res.data)
            .then(data => {
                this.setState({configs: [...this.state.configs, data]});
                return data._id;
            })
            .catch(err => {
                console.log(err);
                return err;
            });
    }

    // First, flush all items in gen single list and gen multi list
    // by posting each config to server and storing resulting ids in configs list
    // Second, post each configs in config list to run path
    generateData() {
        let queuedConfigs = [...this.state.genListSingle.filter(matConfig => matConfig.mat.name !== 'Galactic'), ...this.state.genListMulti];
        if (queuedConfigs.length) {
            console.log('queuedConfigs: ', queuedConfigs);
            this.setState({genConsoleOpen: true});
            this.setState({generatingData: true});
            let promises = [...this.state.genListSingle.filter(matConfig => matConfig.mat.name !== 'Galactic').map((matConfig, indx) => {
                console.log('test1: ', matConfig);
                let newConfig = {
                    mode: 'single',
                    matList: [matConfig.mat, ...[...Array(this.state.numGeantSpots - 1).keys()].map(i => this.state.defaultMat)],
                    lenList: [matConfig.len, ...[...Array(this.state.numGeantSpots - 1).keys()].map(i => {
                        return {single: true, min: 10, max: 100, part: 30}
                    })],
                };
                return this.uploadConfig(newConfig)
                    .then(id => {
                        console.log('test2:', id);
                        return id;
                    })
                    .catch(err => console.log(err))
            })
                // ,...this.state.genListMulti.map((matSet,indx) => {
                //
                // })];
            ];

            Promise.all(promises).then((configIDsToRun) =>
                this.state.genSocket.emit('runConfigs', configIDsToRun)
            );
        }
    };

    runAnalysis() {
        axios.post('http://10.103.72.187:5000/api/v1/analyzer/new', this.state.analysisData).then(res => {
            const id = res.data._id;
            this.setState({currentAnalyzer: id});
            this.state.analyzerSocket.emit('runAnalyzer', id);
        });
    };

    changeSettings(settings) {
        // console.log('changing settings');
        // console.log(this.state);
        // console.log(settings);
        this.setState(settings);
    };

    changePage(page, buttonPhrase, buttonState) {
        let newSettings = this.props.global;
        newSettings.currentView = page;
        newSettings.runButtonPhrase = buttonPhrase;
        newSettings.runButtonActivated = buttonState;
        console.log('changing settings:');
        console.log(this.props.global);
        console.log('-->');
        console.log(newSettings);
        this.props.changeSettings(newSettings);
    };


    changeButtonPhrase(runButtonPhrase) {
        this.setState({runButtonPhrase});
    };

    changeButtonState(runButtonActivated) {
        this.setState({runButtonActivated});
        this.state.runButtonPhrase === 'Generate Data' ? this.generateData() : this.runAnalysis();
    };

    initSettings() {
        axios.get('http://10.103.72.187:5000/api/v1/props')
            .then(res => res.data)
            .then(data => this.setState({settings: data[0]}));
        let i = 0;
        let list = [];
        for (i; i < this.state.numGeantSpots; i++) {
            list.push({
                mat: {name: 'Galactic', color: '#000000', installed: true},
                len: {single: true, min: 10, max: 100, part: 30},
                html: <li className='mx-1 my-1 list-unstyled d-flex align-items-stretch' key={i}><MatCard
                    mat={{name: 'Galactic', color: '#000000', installed: true}} indx={i}
                    len={{single: true, min: 10, max: 100, part: 30}} mode='entry'
                    updateGenList={this.updateGenList} genListRemove={this.genListRemove}/></li>
            });
        }
        this.setState({genListSingle: list});
    };

    componentDidMount() {
        console.log('app mount');
        this.initSettings();
        this.state.genSocket.on('runConfigsClient', data => {
            this.setState({genConsole: this.state.genConsole + data + '\n'})
        });
        this.state.analyzerSocket.on('runAnalyzerStdout', data => {
            this.setState({analysisConsole: this.state.analysisConsole + data + '\n'})
        });
        this.state.analyzerSocket.on('runAnalyzerStderr', data => {
            this.setState({analysisConsole: this.state.analysisConsole + data + '\n'})
        });
        this.state.analyzerSocket.on('runAnalyzerData', data => {
            this.setState(state => (state.analysisData.eOut = data, state));
        });
    };

    printProps() {
        console.log(this.state.settings);
    };

    render() {
        return (
            <Router>
                <Container fluid className='p-0 m-0 grayB4' style={{border: 'none'}}>
                    <Header global={this.state}
                            changeSettings={this.changeSettings}
                            changeButtonState={this.changeButtonState}/>
                    <Route path={'/settings'}
                           render={props => <SetProperties  {...props}
                                                            global={this.state}
                                                            changeSettings={this.changeSettings}
                                                            generateData={this.generateData}
                                                            runAnalysis={this.runAnalysis}
                                                            changeButtonState={this.changeButtonState}/>}/>
                    <Route path={'/gen_data'}
                           render={props => <GenerateData {...props}
                                                          global={this.state}
                                                          updateGenList={this.updateGenList}
                                                          changeSettings={this.changeSettings}
                                                          closeGenConsole={this.closeGenConsole}
                                                          changeButtonState={this.changeButtonState}/>}/>
                    <Route path={'/analyze'}
                           render={props => <AnalyzeData  {...props}
                                                          global={this.state}
                                                          changeSettings={this.changeSettings}
                                                          changeButtonState={this.changeButtonState}
                                                          updateInput={this.updateInput}
                                                          changeWeights={this.changeWeights}/>}/>
                </Container>
            </Router>
        );
    }
}

export default ParentPage;