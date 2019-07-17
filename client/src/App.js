import React, {Component} from 'react';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import {Container} from 'react-bootstrap';
import Header from './Components/Header';
import GenerateData from './Pages/GenerateData';
import SetProperties from './Pages/SetProperties';
import AnalyzeData from './Pages/AnalyzeData';
import MatCard from './Components/MatCard/MatCard';
import './App.css';
import axios from "axios";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: '',
            runButtonPhrase: '',
            runButtonActivated: false,
            settings: [],
            numGeantSpots: 5,
            genListSingle: [],
            configs: [],
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

    }

    updateGenList(index, mat, len) {
        console.log('updating: ', index, mat, len);
        let temp = this.state.genListSingle.slice(0, this.state.numGeantSpots);
        let tempLen = len ? len : {single: true, min: 10, max: 100, part: 30};
        temp[index] = {mat: mat, len: tempLen, html: <li className='mx-1 my-1 list-unstyled d-flex align-items-stretch' key={index}><MatCard
            mat={mat} indx={index} len={tempLen} mode='entry' updateGenList={this.updateGenList} genListRemove={this.genListRemove}/>
        </li>};
        console.log('updated add: ', temp);
        this.setState({genListSingle: temp});
    }

    genListRemove(index) {
        let temp = this.state.genListSingle.slice();
        temp[index] = {mat: {name: `Vacuum`, color: '#000000', installed: true}, len: {single: true, min: 10, max: 100, part: 30}, html: <li className='mx-1 my-1 list-unstyled d-flex align-items-stretch' key={index}><MatCard
            mat={{name: `Vacuum`, color: '#000000', installed: true}} indx={index} len={{single: true, min: 10, max: 100, part: 30}} mode='entry' updateGenList={this.updateGenList} genListRemove={this.genListRemove}/>
        </li>};
        console.log('updated remove: ', temp, index);
        this.setState({genListSingle: temp});
    }


    generateData() {
        let addConfig = new Promise((result,error) => {
            let currentConfigs = this.state.configs.slice();
            let newConfig = {
                mode: 'single',
                matList: this.state.genListSingle.map(item => item.mat),
                lenList: this.state.genListSingle.map(item => item.len),
                flags: ['-together']
            };
            console.log('New Config: ', newConfig);
            axios.post(`http://localhost:5000/api/v1/config/new`, newConfig)
                .then(res => res.data)
                .then(data => {this.setState({configs: [...currentConfigs,data]}); result(data._id);})
                .catch(err => {console.log(err); error(err)});
        });
        addConfig.then(id => {
            axios.get(`http://localhost:5000/api/v1/config/${id}/run`)
                .then(res => res.data)
                .then(data => console.log('Generate Data Res: ', data))
                .catch(err => console.log(err));
        })
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
            list.push({mat: {name: `Vacuum`, color: '#000000', installed: true}, len: {single: true, min: 10, max: 100, part: 30}, html: <li className='mx-1 my-1 list-unstyled d-flex align-items-stretch' key={i}><MatCard
                mat={{name: `Vacuum`, color: '#000000', installed: true}} indx={i} len={{single: true, min: 10, max: 100, part: 30}} mode='entry'
                updateGenList={this.updateGenList} genListRemove={this.genListRemove}/></li>});
        }
        this.setState({genListSingle: list});
    };

    componentDidMount() {
        console.log('app mount');
        this.initSettings();
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

export default App;