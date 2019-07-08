import React, {Component} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {InputGroup, FormControl, Form} from 'react-bootstrap';

class MatCard extends Component {
    constructor(props) {
        super(props);
        this.state = {mat: this.props.mat, mode: this.props.mode};
    }

    render() {
        const {mode} = this.state;
        return (
            <Container className='light' style={mode === 'entry' ? {
                outline: '1px dashed #000000',
                width: '120px'
            } : {background: 'light', border: '1px solid gray', width: '60px', boxShadow:'0 1px 4px 2px rgba(0,0,0,0.25)'}}>
                <Row style={mode === 'entry' ? {padding: '40px 0 40px 0'} : {padding: '20px 0 0px 0'}}>
                    <Col style={mode === 'entry' ? {width: '120px'} : {width: '80px'}}>
                        <p className='text-center text-darkest'
                           style={mode === 'entry' ? {fontSize: '24px'} : {fontSize: '16px'}}>
                            {this.state.mat.title}
                        </p>
                    </Col>
                </Row>
                {this.state.mat.title === 'Vacuum' && mode === 'entry' ?
                    <Row><Col className='col-12'><p className='d-flex justify-content-center'
                                                    style={{fontSize: '100px'}}>+</p></Col></Row> : <Row><Col><span
                        style={{
                            height: '20px',
                            width: '20px',
                            margin: 'auto',
                            padding: '0',
                            background: `${this.state.mat.color}`,
                            borderRadius: '50%',
                            display: 'block'
                        }}/></Col></Row>}
                {mode === 'entry' && this.state.mat.title !== 'Vacuum' ?
                    <Row>
                        <Container className='m-0 p-0'>
                            <br/><br/><br/><br/><br/>
                            <Row className='m-0 p-0'>
                                <Col className='col-1 p-0'/>
                                <Col className='col-10 p-0'>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text className='m-0 pl-1 pr-1' id="basic-addon1">Length</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            placeholder="10"
                                            aria-label="Length"
                                            aria-describedby="basic-addon1"
                                            style={{margin: '0', padding: '5px'}}
                                        />
                                    </InputGroup>
                                </Col>
                                <Col className='col-1 p-0'/>
                            </Row>
                        </Container>
                    </Row>
                    : this.state.mat.title !== 'Vacuum' ?
                        <Row className='my-1'><Col className='text-center'><img
                            src={'https://mdbootstrap.com/img/svg/hamburger7.svg?color=000000'}
                            style={{height: 'auto', width: 'auto'}}/></Col></Row> : ''}
            </Container>
        );
    }
}

export default MatCard;