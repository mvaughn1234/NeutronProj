import React, {Component} from 'react';
import {Container, Row, Col} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap';
import {Nav} from 'react-bootstrap';
import {ButtonToolbar, ButtonGroup, Button} from 'react-bootstrap';
import Jumbotron from "react-bootstrap/Jumbotron";
import DataChart from '../Components/Chart/Chart';

class AnalyzeData extends Component {
    constructor(props) {
        super(props);
        this.state = {url: this.props.url,
            outerPageCorner: 15,
            innerPageCorner: 10,
            inputEnergy: [],
            desiredEnergy: [],
            outputEnergy: [],
            inputDim: {width: 400, height: 200},
            outputDim: {width: 250, height: 125},
            view: '',
        }
    }

    componentDidMount() {
        this.setState({view: (!this.state.view || 0 === this.state.view.length) ? 'input' : this.state.view});
        // let inputSet =
    }

    render() {
        const numBins = this.props.global.settings.settings.find(setting => setting.title === 'Num Bins');
        return (
            <Container fluid className='gray5' style={{margin: '0', padding: '0 10px 10px 10px'}}>
                <Row className='m-0 pl-0 pt-0 pb-2 pr-auto'>
                    <ButtonGroup className='m-0 p-0'>
                        <Button style={{borderRadius: `0 0 0 ${this.state.outerPageCorner}px`}}>Configure</Button>
                        <Button style={{borderRadius: `0 0 ${this.state.outerPageCorner}px 0`}}>Display</Button>
                    </ButtonGroup>
                </Row>
                <Row className='m-0 p-0'>
                    <Col className='m-0 py-0 pl-0 pr-1'>
                        <Container className='p-1 m-0'>
                            <Row className='m-0 px-0 pt-0 pb-1'>
                                <ButtonGroup className='m-0 p-0'>
                                    <Button style={{borderRadius: `0 0 0 ${this.state.outerPageCorner}px`}}>Configure</Button>
                                    <Button style={{borderRadius: `0 0 ${this.state.outerPageCorner}px 0`}}>Display</Button>
                                </ButtonGroup>
                            </Row>
                            <Row className='m-0 p-0'>
                                <DataChart data={this.state.inputEnergy}/>
                            </Row>
                        </Container>
                    </Col>
                    <Col>
                        <Container>

                        </Container>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default AnalyzeData;