import React, {Component} from 'react'
import {LinkContainer} from 'react-router-bootstrap';
import {Navbar, Nav} from "react-bootstrap";
import {Button} from 'react-bootstrap';

class Header extends Component {
    render() {
        return (
            <Navbar expand="lg" className='light font-weight-bold'>
                <Nav defaultActiveKey="props" className="mr-auto d-flex flex-row">
                    <LinkContainer to={'/settings'}>
                        <Nav.Item>
                            <Nav.Link href={'/settings'} className='m-1'
                                      eventKey={'settings'}>Settings</Nav.Link>
                        </Nav.Item>
                    </LinkContainer>
                    <LinkContainer to={'/gen_data'}>
                        <Nav.Item>
                            <Nav.Link href={'/gen_data'} className='m-1'
                                      eventKey={'gen_data'}>Generate Data</Nav.Link>
                        </Nav.Item>
                    </LinkContainer>
                    <LinkContainer to={'/analyze'}>
                        <Nav.Item>
                            <Nav.Link href={'/analyze'} className='m-1'
                                      eventKey={'analyze'}>Analyze</Nav.Link>
                        </Nav.Item>
                    </LinkContainer>
                </Nav>
                {this.props.global.view !== '/settings' ?
                    <Nav className="ml-auto">
                        <Nav.Item>
                            <Button id='run-btn'
                                    className='blue6'
                                    onClick={this.props.global.changeButtonState(true)}
                                    style={{
                                        borderRadius: '18px',
                                        boxShadow: '0 0 2px 2px rgba(0,0,0,0.2)',
                                        border: '1px outset #21496f',
                                    }}
                            >{this.props.global.runButtonPhrase}</Button>
                        </Nav.Item>
                    </Nav>
                    : ''
                }
            </Navbar>
        );
    }
}

export default Header;