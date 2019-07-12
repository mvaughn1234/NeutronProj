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
            },
            props: [],
            updated: false
        };
        this.changeProps = this.changeProps.bind(this);
        this.createProps = this.createProps.bind(this);
        this.initData = this.initData.bind(this);
        this.printProps = this.printProps.bind(this);
    }

    changeProps(props) {
        this.setState({props: props, updated: true});
        console.log(this.state.props)
    }

    initData(){
        console.log('init data');
        axios.get('/props').then(res => res.data).then(data => data[0] ? this.setState({props: data[0]}) : this.createProps());
    }

    componentDidMount() {
        this.initData();
    }

    printProps(){
        console.log(this.state.props);
    }

    createProps() {
        const tempProps = {
            props:
                {
                    matList: [{name: 'tin', installed: true},
                        {name: 'moly', installed: true},
                        {name: 'graphite', installed: true},
                        {name: 'bh303', installed: true},
                        {name: 'beryllium', installed: true}],
                    settings: [
                        {
                            title: 'Set Scale',
                            description: 'temp',
                            input: 'Button',
                            options: ['Base10', 'Log'],
                            currentValue: 'Base10'
                        },
                        {
                            title: 'Set Scale2',
                            description: 'temp',
                            input: 'Button',
                            options: ['Base10', 'Log'],
                            currentValue: 'Base10'
                        },
                        {
                            title: 'Set Scale3',
                            description: 'temp',
                            input: 'Button',
                            options: ['Base10', 'Log'],
                            currentValue: 'Base10'
                        }
                    ]
                }
        };
        this.setProps(tempProps);
        axios.post('/props/set', tempProps)
            .catch(err => console.log(`err: ${err}`));
    }

    render() {
        return (
            <Router>
                <Container fluid className='p-0 m-0 grayB4' style={{border: 'none'}}>
                    <Header pages={this.state.pages}/>
                    <Route path={this.state.pages.setProps.url}
                           render={props => <SetProperties  url={this.state.pages.setProps.url}
                                                           props={this.state.props} changeProps={this.changeProps}
                                                           initData={this.initData}/>}/>
                    <Route path={this.state.pages.genData.url}
                           render={props => <GenerateData  url={this.state.pages.genData.url}
                                                          props={this.state.props} printProps={this.printProps} initData={this.initData}/>}/>
                    <Route path={this.state.pages.analyze.url}
                           render={props => <AnalyzeData  url={this.state.pages.analyze.url}
                                                         props={this.state.props} initData={this.initData}/>}/>
                </Container>
            </Router>
        );
    }
}

export default App;