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
            genList: []
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

    updateGenList(index, mat) {
        console.log('updating: ', index, mat);
        let temp = this.state.genList.slice(0, this.state.numGeantSpots);
        temp[index] = <li className='mx-1 my-1 list-unstyled d-flex align-items-stretch' key={index}><MatCard
            mat={mat} indx={index} mode='entry' updateGenList={this.updateGenList} genListRemove={this.genListRemove}/>
        </li>;
        console.log('updated: ', temp);
        this.setState({genList: temp});
    }

    genListRemove(index) {
        let temp = this.state.genList.slice(0, this.state.numGeantSpots);
        temp[index] = <li className='mx-1 my-1 list-unstyled d-flex align-items-stretch' key={index}><MatCard
            mat={{name: `Vacuum`, color: '#000000', installed: true}} indx={index} mode='entry' updateGenList={this.updateGenList} genListRemove={this.genListRemove}/>
        </li>;
        console.log('updated: ', temp, index);
        this.setState({genList: temp});
    }

    generateData() {

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
    };

    initSettings() {
        axios.get('http://localhost:5000/api/v1/props')
            .then(res => res.data)
            .then(data => this.setState({settings: data[0]}));
        let i = 0;
        let list = [];
        for (i; i < this.state.numGeantSpots; i++) {
            list.push(<li className='mx-1 my-1 list-unstyled d-flex align-items-stretch' key={i}><MatCard
                mat={{name: `Vacuum`, color: '#000000', installed: true}} indx={i} mode='entry'
                updateGenList={this.updateGenList} genListRemove={this.genListRemove}/></li>);
        }
        this.setState({genList: list});
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
                                                          setGenList={this.setGenList}
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