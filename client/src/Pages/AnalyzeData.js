import React, {Component} from 'react';
import {Container, Row, Col, FormGroup, FormControl} from "react-bootstrap";
import {Button} from 'react-bootstrap';
import {Form, InputGroup} from 'react-bootstrap';
import logspace from 'logspace';
import DataChart from '../Components/Chart/Chart';
import ViewSelect from './../Components/ViewSelect/ViewSelect';
import Weights from './../Components/Weights/Weights';
import SystemPreview from './../Components/SystemPreview/SystemPreview';
import AnalysisConsole from './../Components/AnalysisConsole/AnalysisConsole';

class AnalyzeData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: this.props.url,
            outerPageCorner: 15,
            innerPageCorner: 10,
            inputEnergy: [],
            desiredEnergy: [],
            outputEnergy: [],
            inputDim: {width: 400, height: 200},
            outputDim: {width: 250, height: 125},
            viewOuter: 0,
            viewInner: 0,
            weights: {accuracy: 1, weight: 0, size: 0, cost: 0},
            log: '',
            currentConfiguration: [{mat: 'tin', color: 'blue1'},
                {mat: 'moly', color: 'blue3'},
                {mat: 'bh303', color: 'blue5'},
                {mat: 'graphite', color: 'blue7'},],

        };
        this.updateInput = this.updateInput.bind(this);
        this.changeViewOuter = this.changeViewOuter.bind(this);
        this.changeViewInner = this.changeViewInner.bind(this);
        this.changeWeights = this.changeWeights.bind(this);
    }

    componentDidMount() {
        this.setState({view: (!this.state.view || 0 === this.state.view.length) ? 'input' : this.state.view});
        // let inputSet =
    }

    updateInput(e, target) {
        let tempArr;
        switch (target) {
            case 'In':
                tempArr = this.state.inputEnergy.slice();
                tempArr[Number(e.target.id)] = Number(e.target.value);
                this.setState({inputEnergy: tempArr});
                break;
            case 'desOut':
                tempArr = this.state.desiredEnergy.slice();
                tempArr[Number(e.target.id)] = Number(e.target.value);
                this.setState({desiredEnergy: tempArr});
                break;
            case 'Out':
                tempArr = this.state.outputEnergy.slice();
                tempArr[Number(e.target.id)] = Number(e.target.value);
                this.setState({outputEnergy: tempArr});
                break;
            default:
                break;
        }
    }

    changeViewOuter(e, viewOuter) {
        this.setState({viewOuter});
    }

    changeViewInner(e, viewInner) {
        this.setState({viewInner});
    }

    changeWeights(e, weights) {
        console.log(weights);
        this.setState({weights});
    }

    render() {
        return (
            <Container fluid className='m-0 p-0'>
                <Container className='gray5 p-0' style={{minWidth: '800px', width: '820px'}}>
                    <Row className='m-0 pl-0 pt-0 pb-2 pr-0'>
                        {/*<ButtonGroup className='m-0 p-0'>*/}
                        {/*    <Button style={{borderRadius: `0 0 0 ${this.state.outerPageCorner}px`}}>Configure</Button>*/}
                        {/*    <Button style={{borderRadius: `0 0 ${this.state.outerPageCorner}px 0`}}>Display</Button>*/}
                        {/*</ButtonGroup>*/}
                        <ViewSelect buttons={['Configure', 'Display']} bg={'color2'} size={'14px'} rounded={'full'}
                                    view={this.state.view} changeView={this.changeViewOuter}/>
                    </Row>
                    <Container className='m-0 p-0' style={{width: '100%'}}>
                        {this.state.viewOuter === 0 ?
                            <Row className='m-0 p-0'>
                                <Col className='m-0 py-0 pl-0 pr-1'>
                                    <Container className='p-1 m-0'>
                                        <Row className='m-0 px-0 pt-0 pb-1'>
                                            <ViewSelect buttons={['Input Energy', 'Desired Output Energy']}
                                                        bg={'color2'}
                                                        size={'12px'} rounded={'full'} view={this.state.view}
                                                        changeView={this.changeViewInner}/>
                                        </Row>
                                        <Row className='m-0 p-0'>
                                            {this.state.viewInner === 0 ?
                                                <Form className='overflow-auto' style={{height: '300px'}}>
                                                    <DataChart type={'In'} data={this.state.inputEnergy}
                                                               updateInput={this.updateInput}
                                                               settings={this.props.global.settings.settings}/>
                                                </Form>
                                                :
                                                <Form className='overflow-auto' style={{height: '300px'}}>
                                                    <DataChart type={'desOut'} data={this.state.desiredEnergy}
                                                               updateInput={this.updateInput}
                                                               settings={this.props.global.settings.settings}/>
                                                </Form>
                                            }
                                        </Row>
                                    </Container>
                                </Col>
                                <Col>
                                    <Container className='gray1'>
                                        <Row>
                                            <Col>
                                                <Form>
                                                    <FormGroup className='text-white'>
                                                        <InputGroup className="mb-3">
                                                            <FormControl placeholder="File Path"/>
                                                            <InputGroup.Append>
                                                                <Button variant="outline-secondary"
                                                                        className='blue6 text-white'>Browse</Button>
                                                            </InputGroup.Append>
                                                        </InputGroup>
                                                        <Button className='blue6 btn-md'>Load Setting File</Button>
                                                    </FormGroup>
                                                </Form>
                                            </Col>
                                            <Row>
                                                <Col>
                                                    <Form>
                                                        <FormGroup className='text-white'>
                                                            <FormControl className='mb-3' type='text'
                                                                         placeholder='Setting Title'/>
                                                            <Button className='blue6 btn-md p-auto m-auto'>Save
                                                                Settings</Button>
                                                        </FormGroup>
                                                    </Form>
                                                </Col>
                                            </Row>
                                        </Row>
                                        <Row>
                                            <Weights changeWeights={this.changeWeights} weights={this.state.weights}/>
                                        </Row>
                                    </Container>
                                </Col>
                            </Row>
                            :
                            <Row className='m-0 p-0'>
                                <Col className='m-0 p-0'>
                                    <Row className='m-0 p-0'>
                                        <DataChart type={'output'} className='m-0 p-0'
                                                   data={[this.state.desiredEnergy, this.state.outputEnergy]}
                                                   settings={this.props.global.settings.settings}/>

                                    </Row>
                                    <Row className='my-2 mx-0 p-0 px-3'>
                                        <Col className='col-4 m-0 p-0 text-center dark'>
                                            <p className={'text-white'} style={{fontSize: '16px'}}>1234 [gm]</p>
                                            <p className={'text-white'} style={{fontSize: '12px'}}>(weight)</p>
                                        </Col>
                                        <Col className='col-4 m-0 p-0 text-center dark'>
                                            <p className={'text-white'} style={{fontSize: '16px'}}>1234 [cm]</p>
                                            <p className={'text-white'} style={{fontSize: '12px'}}>(size)</p>
                                        </Col>
                                        <Col className='col-4 m-0 p-0 text-center dark'>
                                            <p className={'text-white'} style={{fontSize: '16px'}}>$1234</p>
                                            <p className={'text-white'} style={{fontSize: '12px'}}>(cost)</p>
                                        </Col>
                                    </Row>
                                    <Row className='my-2 mx-0 p-0 px-3'>
                                        <Col className='col-3 m-0 p-0 py-1 text-center dark' style={{border: '1px solid black'}}>
                                            <p className={'text-white m-0 p-0'} style={{fontSize: '16px'}}>{this.state.currentConfiguration[0].mat}</p>
                                        </Col>
                                        <Col className='col-3 m-0 p-0 py-1 text-center dark' style={{border: '1px solid black'}}>
                                            <p className={'text-white m-0 p-0'} style={{fontSize: '16px'}}>{this.state.currentConfiguration[1].mat}</p>
                                        </Col>
                                        <Col className='col-3 m-0 p-0 py-1 text-center dark' style={{border: '1px solid black'}}>
                                            <p className={'text-white m-0 p-0'} style={{fontSize: '16px'}}>{this.state.currentConfiguration[2].mat}</p>
                                        </Col>
                                        <Col className='col-3 m-0 p-0 py-1 text-center dark' style={{border: '1px solid black'}}>
                                            <p className={'text-white m-0 p-0'} style={{fontSize: '16px'}}>{this.state.currentConfiguration[3].mat}</p>
                                        </Col>
                                    </Row>
                                    <Row className='px-3 pb-0 pt-auto mx-0 mb-0 mt-auto'>
                                        <Weights changeWeights={this.changeWeights} weights={this.state.weights}/>
                                    </Row>
                                </Col>
                                <div className='mr-0 ml-auto p-0'>
                                    <Container>
                                        <Row className='mb-2'>
                                            <SystemPreview configuration={this.state.currentConfiguration} matlist={this.state.currentConfiguration} />
                                        </Row>
                                        <Row>
                                            <AnalysisConsole log={this.state.log} progress={this.state.progress}/>
                                        </Row>
                                    </Container>
                                </div>
                            </Row>
                        }
                    </Container>
                </Container>
            </Container>
        );
    }
}

export default AnalyzeData;