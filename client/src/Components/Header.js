import React, {Component} from 'react'
import {LinkContainer} from 'react-router-bootstrap';
import {Navbar, Nav} from "react-bootstrap";
import {Button} from 'react-bootstrap';

class Header extends Component {
    constructor(props){
        super(props);
        this.changePage = this.changePage.bind(this);
    }

    changePage(page,buttonPhrase,buttonState){
        let newSettings = this.props.global;
        newSettings.currentView = page;
        newSettings.runButtonPhrase = buttonPhrase;
        newSettings.runButtonActivated = buttonState;
        // console.log('changing settings:');
        // console.log(this.props.global);
        // console.log('-->');
        // console.log(newSettings);
        this.props.changeSettings(newSettings);
    }

    render() {
        return (
            <Navbar expand="lg" className='light font-weight-bold'>
                {/*{console.log(this.props.global)}*/}
                <Navbar.Brand href="/">Neutron Project</Navbar.Brand>
                <Nav defaultActiveKey="props" className="mr-auto d-flex flex-row">
                    <LinkContainer to={'/settings'} onClick={() => this.changePage('/settings','', false)}>
                        <Nav.Item>
                            <Nav.Link href={'/settings'} className='m-1'
                                      eventKey={'settings'}>Settings</Nav.Link>
                        </Nav.Item>
                    </LinkContainer>
                    <LinkContainer to={'/gen_data'} onClick={() => this.changePage('/gen_data','Generate Data', true)}>
                        <Nav.Item>
                            <Nav.Link href={'/gen_data'} className='m-1'
                                      eventKey={'gen_data'}>Generate Data</Nav.Link>
                        </Nav.Item>
                    </LinkContainer>
                    <LinkContainer to={'/analyze'} onClick={() => this.changePage('/analyze','Start Analysis', true)}>
                        <Nav.Item>
                            <Nav.Link href={'/analyze'} className='m-1'
                                      eventKey={'analyze'}>Analyze</Nav.Link>
                        </Nav.Item>
                    </LinkContainer>
                </Nav>
                <Nav className="ml-auto">
                    <Nav.Item>
                        <Button id='run-btn'
                                className='blue6'
                                onClick={() => this.props.changeButtonState(true)}
                                style={(this.props.global.currentView === '/analyze' || this.props.global.currentView === '/gen_data') ? {
                                    borderRadius: '18px',
                                    boxShadow: '0 0 2px 2px rgba(0,0,0,0.2)',
                                    border: '1px outset #21496f',
                                    display: 'flex'
                                } : {display: 'none'}}
                        >{this.props.global.runButtonPhrase}</Button>
                    </Nav.Item>
                </Nav>
            </Navbar>
        );
    }
}

export default Header;