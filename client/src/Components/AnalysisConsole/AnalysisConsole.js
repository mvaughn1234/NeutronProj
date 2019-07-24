import React, {Component} from 'react';
import {Container, Jumbotron} from "react-bootstrap";

class AnalysisConsole extends Component{
    constructor(props) {
        super(props);
        this.state = {};
    }

    render(){
        return(
            <Container className='darker my-0 p-0' style={{width: '400px', height: '200px', marginLeft: 'auto', marginRight: '0', boxShadow: '0 0 5px 2px rgba(0,0,0,0.4) inset'}}>
                {this.draw}
            </Container>
        );
    }
}

export default AnalysisConsole;