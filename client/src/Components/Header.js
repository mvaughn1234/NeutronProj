import React, {Component} from 'react'
import {LinkContainer} from 'react-router-bootstrap';
import {Navbar, Nav} from "react-bootstrap";
import {Button} from 'react-bootstrap';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {pages: this.props.pages};
        this.changePage = this.changePage.bind(this);
    }

    changePage(id, e) {
        const {pages} = this.state;
        let runBtn = document.getElementById('run-btn')
        runBtn.hidden = pages[id].runButton ? false : true;
        runBtn.innerHTML = pages[id].runButton;
    }

    render() {
        const {pages} = this.state;
        return (
            <Navbar expand="lg" className='light font-weight-bold'>
                <Nav defaultActiveKey="props" className="mr-auto d-flex flex-row">
                    {Object.keys(pages).map((page, index) =>
                        <LinkContainer to={pages[page].url} key={pages[page].key}
                                       onClick={e => this.changePage(page, e)}>
                            <Nav.Item>
                                <Nav.Link href={pages[page].url} className='m-1'
                                          eventKey={pages[page].key}>{pages[page].title}</Nav.Link>
                            </Nav.Item>
                        </LinkContainer>
                    )}
                </Nav>
                <Nav className="ml-auto">
                    <Nav.Item>
                        <Button id='run-btn' className='blue6' style={{
                            borderRadius: '18px',
                            boxShadow: '0 0 2px 2px rgba(0,0,0,0.2)',
                            border: '1px outset #21496f',
                            hidden: true
                        }}>{this.state.runPhrase}</Button>
                    </Nav.Item>
                </Nav>
            </Navbar>
        );
    }
}

export default Header;