import React, {Component} from 'react';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import {Container} from 'react-bootstrap';
import Header from './Components/Header';
import GenerateData from './Pages/GenerateData';
import SetProperties from './Pages/SetProperties';
import AnalyzeData from './Pages/AnalyzeData';
import ParentPage from './Pages/ParentPage';
import MatCard from './Components/MatCard/MatCard';
import './App.css';
import axios from "axios";

class App extends Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <Router>
                    <Route path={'/'} component={ParentPage}/>
            </Router>
        );
    }
}

export default App;