import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import {LinkContainer} from 'react-router-bootstrap';
import {Nav} from 'react-bootstrap';
import {ButtonToolbar, ButtonGroup, Button} from 'react-bootstrap';
import Jumbotron from "react-bootstrap/Jumbotron";

class AnalyzeData extends Component {
    constructor(props) {
        super(props);
        this.state = {url: this.props.url}
    }

    render() {
        return (
            <Container fluid style={{margin: '0', padding:'10px'}}>
                <Jumbotron fluid className='darkest'>
                    <ButtonGroup className="mr-2" aria-label="Second group">
                        <LinkContainer to={`${this.state.url}/Input`}>
                            <Button>Input</Button>
                        </LinkContainer>
                        <LinkContainer to={`${this.state.url}/Output`}>
                            <Button>Input</Button>
                        </LinkContainer>
                    </ButtonGroup>
                </Jumbotron>
            </Container>
        );
    }
}

export default AnalyzeData;