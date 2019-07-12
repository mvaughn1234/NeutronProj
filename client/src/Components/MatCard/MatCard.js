import React, {Component} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {InputGroup, FormControl, Form} from 'react-bootstrap';

class MatCard extends Component {
    constructor(props) {
        super(props);
        this.state = {mat: this.props.mat, mode: this.props.mode};
        this.styles = this.styles.bind(this);
    }

    styles(element) {
        switch (element) {
            case 'background':
                switch (this.state.mode) {
                    case 'entry':
                        return {outline: '1px dashed #000000', width: '120px'};
                    case 'card' :
                        return this.state.mat.name === 'Vacuum' ? {display: 'none'} :
                            {
                                background: 'light',
                                border: '1px solid gray',
                                // width: '60px',
                                boxShadow: '0 1px 4px 2px rgba(0,0,0,0.25)'
                            };
                    case 'list':
                        return this.state.mat.name === 'Vacuum' ? {display: 'none'} :
                            {
                                background: 'white',
                                border: 'none',
                                margin: '0',
                                padding: '0'
                            };
                    default:
                        return {};
                }
            case 'titleHeight':
                switch (this.state.mode) {
                    case 'entry':
                        return {padding: '40px 0 40px 0'};
                    case 'card' :
                        return {padding: '20px 0 0 0'};
                    case 'list':
                        return {padding: '0', margin: '0'};
                    default:
                        return {};
                }
            case 'titleWidth':
                switch (this.state.mode) {
                    case 'entry':
                        return {width: '120px'};
                    case 'card' :
                        return {minWidth: '60px', width: 'auto', margin: '0', padding: '0', justifyText: 'center'};
                    case 'list':
                        return {width: 'auto', margin: '0', padding: '0'};
                    default:
                        return {};
                }
            case 'title':
                switch (this.state.mode) {
                    case 'entry':
                        return {fontSize: '24px'};
                    case 'card' :
                        return {fontSize: '14px'};
                    case 'list':
                        return {fontSize: '14px', padding: '0', margin: '0'};
                    default:
                        return {};
                }
            case 'indicator':
                switch (this.state.mode) {
                    case 'entry':
                        return {fontSize: '100px'};
                    case 'card' :
                        return {
                            height: '20px',
                            width: '20px',
                            margin: 'auto',
                            padding: '0',
                            background: `${this.state.mat.color}`,
                            borderRadius: '50%',
                            display: 'block'
                        };
                    case 'list':
                        return {
                            height: '20px',
                            width: '20px',
                            margin: '0',
                            padding: '0',
                            background: `${this.state.mat.color}`,
                            borderRadius: '50%',
                            display: 'block'
                        };
                    default:
                        return {};
                }
            default:
                return null;
        }
    }

    render() {
        const {mode} = this.state;
        console.log(`mat: ${this.state.mat}`);
        return (
            <Container className='light' style={this.styles('background')}>
                <Row style={this.styles('titlePadding')}>
                    <Col style={this.styles('titleWidth')}>
                        <p className='text-center text-darkest'
                           style={this.styles('title')}>
                            {this.state.mat.name}
                        </p>
                    </Col>
                    {
                        mode === 'list' ?
                            <Col className='m-0 p-0'><span style={this.styles('indicator')}/></Col>
                            : ''
                    }
                    {
                        mode === 'list' ?
                            <Col className='m-0 p-0 text-center'><img
                                src={'https://mdbootstrap.com/img/svg/hamburger8.svg?color=000000'}
                                style={{height: '20px', width: 'auto'}}/></Col>
                            : ''
                    }
                </Row>
                {
                    mode === 'entry' && this.state.mat.name === 'Vacuum' ?
                        <Row><Col className='col-12'><p className='d-flex justify-content-center'
                                                        style={this.styles('indicator')}>+</p></Col></Row>
                        : mode !== 'list' ?
                        <Row><Col><span style={this.styles('indicator')}/></Col></Row>
                        : ''
                }
                {
                    mode === 'entry' ?
                        <Row>
                            <Container className='m-0 p-0'>
                                <br/><br/><br/><br/><br/>
                                <Row className='m-0 p-0'>
                                    <Col className='col-1 p-0'/>
                                    <Col className='col-10 p-0'>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text className='m-0 pl-1 pr-1'
                                                                 id="basic-addon1">Length</InputGroup.Text>
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
                        :
                        mode === 'card' ?
                            <Row className='my-1'><Col className='text-center'><img
                                src={'https://mdbootstrap.com/img/svg/hamburger7.svg?color=000000'}
                                style={{height: 'auto', width: 'auto'}}/></Col></Row>
                            : ''
                }
            </Container>
        );
    }
}

export default MatCard;