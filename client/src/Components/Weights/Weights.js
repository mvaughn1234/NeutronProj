import React, {Component} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {InputGroup} from "react-bootstrap";

class Weights extends Component {
    constructor(props) {
        super(props);
        this.state = {height: '200px', width: '8px'};
        this.changeWeight = this.changeWeight.bind(this);
    }

    changeWeight(e, weight) {
        let weights = Object.assign(this.props.weights);
        weights[weight] = e.target.value;
        return weights;
    }

    render() {
        return (
            <Container className='p-2 dark text-white'>
                {Object.keys(this.props.weights).map(weight =>
                    <Row className='m-0 p-0 d-flex justify-content-center' key={weight}>
                        <InputGroup className={'w-100'}>
                            <Col className='col-3 m-0 p-0 text-center'>
                                <p style={{fontSize: '14px'}}>{weight}</p>
                            </Col>
                            <Col>
                                <form className="range-field">
                                    <input className="border-0 slider" type="range" min="0" max="1" step='0.1'
                                           onChange={(e) => this.props.changeWeights(e, this.changeWeight(e, weight))}
                                           value={this.props.weights[weight]} style={{width: '100%'}}/>
                                </form>
                            </Col>
                        </InputGroup>
                    </Row>
                )}
            </Container>
        );
    }
}

export default Weights;