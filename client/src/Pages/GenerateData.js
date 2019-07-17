import React, {Component} from 'react';
import {Navbar, Nav} from 'react-bootstrap';
import {Container, Row, Col} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import {BrowserRouter as Router, Link, Route} from "react-router-dom";
import Gen1 from './../Containers/Gen1';
import Gen2 from './../Containers/Gen2';
import Gen3 from './../Containers/Gen3';
import MatCard from "../Components/MatCard/MatCard";

class GenerateData extends Component {
    constructor(props) {
        super(props);
        this.state = {url: '/gen_data'}
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col className='col-2 p-0 gray5' variant='dark'>
                        <Nav defaultActiveKey="gen1" className="flex-column" style={{margin: '30px 0 0 0'}}>
                            <div className='mt-2 blue7' style={{boxShadow: '0 4px 5px 2px rgba(0,0,0,0.25)'}}>
                                <LinkContainer to={`${this.state.url}`}>
                                    <Nav.Item>
                                        <Nav.Link href={`${this.state.url}`} className='text-light'
                                                  eventKey='gen1'>Single Material</Nav.Link>
                                    </Nav.Item>
                                </LinkContainer>
                            </div>
                            <div className='gray6' style={{margin: '10px 0 0 0'}}>
                                <LinkContainer to={`${this.state.url}/gen2`}>
                                    <Nav.Item>
                                        <Nav.Link href={`${this.state.url}/gen2`} className='text-light'
                                                  eventKey='gen2'>Multi Material</Nav.Link>
                                    </Nav.Item>
                                </LinkContainer>
                            </div>
                            {/*<div className='gray6' style={{margin: '10px 0 0 0'}}>*/}
                            {/*    <LinkContainer to={`${this.state.url}/gen3`}>*/}
                            {/*        <Nav.Item>*/}
                            {/*            <Nav.Link href={`${this.state.url}/gen3`} className='text-light'*/}
                            {/*                      eventKey='gen3'>Gen 3</Nav.Link>*/}
                            {/*        </Nav.Item>*/}
                            {/*    </LinkContainer>*/}
                            {/*</div>*/}
                        </Nav>
                    </Col>
                    <Col className='m-0 p-0 col-10'>
                        <Route path={`${this.state.url}`} exact render={(props) => <Gen1 global={this.props.global} setGenList={this.props.setGenList}/>}/>
                        <Route path={`${this.state.url}/gen2`} component={Gen2}/>
                        {/*<Route path={`${this.state.url}/gen3`} component={Gen3}/>*/}
                    </Col>
                </Row>
                <Row className='bg-white'>
                    <Col className='col-2 p-0'/>
                    <Col className='col-8 p-0'
                        // style={{boxShadow: '0 0 2px 2px rgba(0,0,0,0.2) inset'}}
                    >
                        <ul className='m-0 p-0' style={{display: 'flex'}}>
                            {this.props.global.settings.matList ? this.props.global.settings.matList.length > 0 ?
                                this.props.global.settings.matList.map((mat, index) =>
                                    mat.name !== 'Vacuum' ?
                                        <li className='mx-1 my-1 list-unstyled d-flex align-items-stretch' key={index}><MatCard
                                            mat={mat} len={{single: true, min: 10, max: 100, part: 30}} mode={'card'} updateGenList={this.updateGenList}/></li>
                                        : ''
                                )
                                : ''

                                : ''}
                        </ul>
                    </Col>
                    <Col className='col-2 p-0'/>
                </Row>
            </Container>
        );
    }
}

export default GenerateData;