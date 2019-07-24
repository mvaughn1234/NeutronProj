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
            generatingData: false,
            settings: [],
            numGeantSpots: 4,
            genListSingle: [],
            genListMulti: [],
            configs: [],
            defaultMat: {name: 'Vacuum', installed: true, color: '#000000'},
            socket: io('http://localhost:5001'),
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
            mat: {name: `Vacuum`, color: '#000000', installed: true},
            len: {single: true, min: 10, max: 100, part: 30},
            html: <li className='mx-1 my-1 list-unstyled d-flex align-items-stretch' key={index}><MatCard
                mat={{name: `Vacuum`, color: '#000000', installed: true}} indx={index}
                len={{single: true, min: 10, max: 100, part: 30}} mode='entry' updateGenList={this.updateGenList}
                genListRemove={this.genListRemove}/>
            </li>
        };
        console.log('updated remove: ', temp, index);
        this.setState({genListSingle: temp});
    }

    uploadConfig(config) {
        return axios.post(`http://localhost:5000/api/v1/config/new`, config)
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
        let queuedConfigs = [...this.state.genListSingle.filter(matConfig => matConfig.mat.name !== 'Vacuum'), ...this.state.genListMulti];
        if (queuedConfigs.length) {
            console.log('queuedConfigs: ', queuedConfigs);
            this.setState({genConsoleOpen: true});
            this.setState({generatingData: true});
            let promises = [...this.state.genListSingle.filter(matConfig => matConfig.mat.name !== 'Vacuum').map((matConfig, indx) => {
                console.log('test1: ', matConfig);
                let newConfig = {
                    mode: 'single',
                    matList: [matConfig.mat, ...[...Array(this.state.numGeantSpots - 1).keys()].map(i => this.state.defaultMat)],
                    lenList: [matConfig.len, ...[...Array(this.state.numGeantSpots - 1).keys()].map(i => {return {single: true, min: 10, max: 100, part: 30}})],
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
                this.state.socket.emit('runConfigs',configIDsToRun)
            );
        }
    };

    runAnalysis() {

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
        this.generateData();
    };

    initSettings() {
        axios.get('http://localhost:5000/api/v1/props')
            .then(res => res.data)
            .then(data => this.setState({settings: data[0]}));
        let i = 0;
        let list = [];
        for (i; i < this.state.numGeantSpots; i++) {
            list.push({
                mat: {name: `Vacuum`, color: '#000000', installed: true},
                len: {single: true, min: 10, max: 100, part: 30},
                html: <li className='mx-1 my-1 list-unstyled d-flex align-items-stretch' key={i}><MatCard
                    mat={{name: `Vacuum`, color: '#000000', installed: true}} indx={i}
                    len={{single: true, min: 10, max: 100, part: 30}} mode='entry'
                    updateGenList={this.updateGenList} genListRemove={this.genListRemove}/></li>
            });
        }
        this.setState({genListSingle: list});
    };

    componentDidMount() {
        console.log('app mount');
        this.initSettings();
        this.state.socket.on('runConfig', data => console.log('runConfig: ', JSON.stringify(data)))
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
                                                          changeButtonState={this.changeButtonState}/>}/>
                </Container>
            </Router>
        );
    }
}

export default ParentPage;