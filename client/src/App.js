import React from 'react';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import Header from './Components/Header';
import GenerateData from './Pages/GenerateData';
import SetProperties from './Pages/SetProperties';
import AnalyzeData from './Pages/AnalyzeData';
import './App.css';

function App() {
  return (
      <Router>
        <div className="container">
          <Header />
          <div className={"container"}>
            <Route path={"/"} exact component={SetProperties} />
            <Route path={"/gen"} component={GenerateData} />
            <Route path={"/analyze"} component={AnalyzeData} />
          </div>
        </div>
      </Router>
  );
}

export default App;