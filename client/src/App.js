import React, {Component} from 'react';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import {Container} from 'react-bootstrap';
import Header from './Components/Header';
import GenerateData from './Pages/GenerateData';
import SetProperties from './Pages/SetProperties';
import AnalyzeData from './Pages/AnalyzeData';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: {
                setProps: {
                    title: 'Set Properties',
                    url: '/set_properties',
                    key: 'props'
                },
                genData: {
                    title: 'Generate Data',
                    url: '/gen_data',
                    key: 'gen',
                    runButton: 'Generate Data'
                },
                analyze: {
                    title: 'Analyze',
                    url: '/analyze',
                    key: 'analyze',
                    runButton: 'Analyze Data'
                }
            }
        }
    }

    render() {
        return (
            <Router>
                <Container fluid className='p-0 m-0' >
                    <Header pages={this.state.pages}/>
                    <Route path={this.state.pages.setProps.url}
                           render={props => <SetProperties {...props} url={this.state.pages.setProps.url}/>}/>
                    <Route path={this.state.pages.genData.url}
                           render={props => <GenerateData {...props} url={this.state.pages.genData.url}/>}/>
                    <Route path={this.state.pages.analyze.url}
                           render={props => <AnalyzeData {...props} url={this.state.pages.analyze.url}/>}/>
                </Container>
            </Router>
        );
    }
}

export default App;