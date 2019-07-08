import React, {Component} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import MatCard from './../Components/MatCard/MatCard';

class Gen1 extends Component {
    constructor(props) {
        super(props);
        this.state = {mats: this.props.mats};
    }

    render() {
        return (
            <Container fluid className='gray1'>
                <Row>
                    <Col className='col-7'>
                        <Container>
                            <Row>
                                <Col>
                                    <div style={{height: '80px'}}/>
                                    {/*<GenMode />*/}
                                </Col>
                            </Row>
                            <Row >
                                <Col className='col-12 overflow-auto'>
                                    <ul className='m-0 p-0 d-flex' style={{display: 'flex'}}>
                                        {this.state.mats.map((mat, index) =>
                                            <li className='mx-1 my-1 list-unstyled d-flex align-items-stretch'><MatCard mat={mat} mode={'entry'} key={index}/></li>
                                        )}
                                    </ul>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div style={{height: '50px'}}/>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                    <Col className='col-3 d-flex align-items-stretch'>
                        <Container className='my-2 blue6 text-light' style={{boxShadow:'0 1px 2px 1px rgba(0,0,0,0.2) inset'}}>
                            <ul className='m-0 p-0'>
                                <Row><Col>awefawef</Col></Row>
                                <Row><Col>awefawef</Col></Row>
                                <Row><Col>awefawef</Col></Row>
                                <Row><Col>awefawef</Col></Row>
                                <Row><Col>awefawef</Col></Row>
                            </ul>
                        </Container>
                    </Col>
                    <Col className='col-2 d-flex align-items-stretch'>
                        <Container className='my-2 blue6 text-light' style={{boxShadow:'0 1px 2px 1px rgba(0,0,0,0.2) inset'}}>
                            <ul className='m-0 p-0'>
                                <Row><Col>awefawef</Col></Row>
                                <Row><Col>awefawef</Col></Row>
                                <Row><Col>awefawef</Col></Row>
                                <Row><Col>awefawef</Col></Row>
                                <Row><Col>awefawef</Col></Row>
                            </ul>
                        </Container>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Gen1;