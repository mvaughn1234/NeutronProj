import React, {Component} from 'react';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import {Container} from 'react-bootstrap';
import Header from './Components/Header';
import GenerateData from './Pages/GenerateData';
import SetProperties from './Pages/SetProperties';
import AnalyzeData from './Pages/AnalyzeData';
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
        };
        this.changeSettings = this.changeSettings.bind(this);
        this.createProps = this.createProps.bind(this);
        this.initSettings = this.initSettings.bind(this);
        this.printProps = this.printProps.bind(this);
        this.changeButtonPhrase = this.changeButtonPhrase.bind(this);
        this.changeButtonState = this.changeButtonState.bind(this);
    }

    changeSettings(settings) {
        this.setState({settings});
    }

    changeButtonPhrase(runButtonPhrase) {
        this.setState({runButtonPhrase});
    }

    changeButtonState(runButtonActivated) {
        this.setState({runButtonActivated});
    }

    initSettings() {
        axios.get('/settings')
            .then(res => res.data)
            .then(data => this.setState({props: data[0]}));
    }

    componentDidMount() {
        console.log('app mount');
        this.initSettings();
    }

    printProps() {
        console.log(this.state.settings);
    }

    render() {
        return (
            <Router>
                <Container fluid className='p-0 m-0 grayB4' style={{border: 'none'}}>
                    <Header global={this.state}/>
                    <Route path={'/settings'}
                           render={props => <SetProperties  {...props}
                                                            global={this.state}
                                                            changeSettings={this.changeSettings}
                                                            changeButtonState={this.changeButtonState()}
                                                            changeButtonPhrase={this.changeButtonPhrase}/>}/>
                    <Route path={'/gen_data'}
                           render={props => <GenerateData {...props}
                                                          global={this.state}
                                                          changeSettings={this.changeSettings}
                                                          changeButtonState={this.changeButtonState()}
                                                          changeButtonPhrase={this.changeButtonPhrase}/>}/>
                    <Route path={'/analyze'}
                           render={props => <AnalyzeData  {...props}
                                                          global={this.state}
                                                          changeSettings={this.changeSettings}
                                                          changeButtonState={this.changeButtonState()}
                                                          changeButtonPhrase={this.changeButtonPhrase}/>}/>
                </Container>
            </Router>
        );
    }
}

export default App;