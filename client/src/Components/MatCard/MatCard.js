import React, {Component} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {InputGroup, FormControl, Form} from 'react-bootstrap';
import Popover from 'react-bootstrap/Popover'
// import PopoverContent from 'react-bootstrap/PopoverContent'
// import PopoverTitle from 'react-bootstrap/PopoverTitle'
import Tooltip from 'react-bootstrap/Tooltip'
import Overlay from 'react-bootstrap/Overlay'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import {Button, ButtonToolbar} from 'react-bootstrap';

class MatCard extends Component {
    constructor(props) {
        super(props);
        this.state = {lengthInput: false};
        this.styles = this.styles.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.trackLengthText = this.trackLengthText.bind(this);
    }

    styles(element) {
        switch (element) {
            case 'dragging':
                switch (this.props.mode) {
                    case 'entry':
                        return {outline: '1px dashed #000000', width: '120px'};
                    case 'card' :
                        return this.props.mat.name === 'Vacuum' ? {display: 'none'} :
                            {
                                background: 'light',
                                border: '1px solid gray',
                                // width: '60px',
                                boxShadow: '0 1px 4px 2px rgba(0,0,0,0.25)',
                                opacity: 0.5
                            };
                    case 'list':
                        return this.props.mat.name === 'Vacuum' ? {display: 'none'} :
                            {
                                background: 'white',
                                border: 'none',
                                margin: '0',
                                padding: '0'
                            };
                    default:
                        return {};
                }
            case 'background':
                switch (this.props.mode) {
                    case 'entry':
                        return {
                            outline: this.props.mat.name === 'Vacuum' ? '1px dashed #000000' : '1px solid #000000',
                            width: '120px'
                        };
                    case 'card' :
                        return this.props.mat.name === 'Vacuum' ? {display: 'none'} :
                            {
                                background: 'light',
                                border: '1px solid gray',
                                // width: '60px',
                                boxShadow: '0 1px 4px 2px rgba(0,0,0,0.25)'
                            };
                    case 'list':
                        return this.props.mat.name === 'Vacuum' ? {display: 'none'} :
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
                switch (this.props.mode) {
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
                switch (this.props.mode) {
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
                switch (this.props.mode) {
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
                switch (this.props.mode) {
                    case 'entry':
                        return (this.props.mat.name === 'Vacuum' ? {fontSize: '100px', color: 'black'} :
                            {
                                fontSize: '100px',
                                color: '#951014',
                                height: '50px',
                                margin: '60px 0 70px 0',
                                padding: '0 0.1em 50px 0.1em',
                                display: 'inline-flex',
                                alignItems: 'center',
                                verticalAlign: 'middle',
                                lineHeight: '0.25em',
                                boxSizing: 'border-box',
                                border: 'none',
                                boxShadow: '0 0 5px 2px rgba(0,0,0,0.2)',
                                borderRadius: '20px'
                                // overflow: 'hidden'
                            });
                    case 'card' :
                        return {
                            height: '20px',
                            width: '20px',
                            margin: 'auto',
                            padding: '0',
                            background: `${this.props.mat.color}`,
                            borderRadius: '50%',
                            display: 'block'
                        };
                    case 'list':
                        return {
                            height: '20px',
                            width: '20px',
                            margin: '0',
                            padding: '0',
                            background: `${this.props.mat.color}`,
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

    onDragStart = (event, mat) => {
        console.log('dragstart: ', mat);
        event.dataTransfer.setData("mat", JSON.stringify(mat));
    };

    onDragOver = (event) => {
        event.preventDefault();
    };

    onDrop = (event, mode) => {
        event.preventDefault();
        let mat = JSON.parse(event.dataTransfer.getData("mat"));
        console.log('drop3: ', mat);
        this.props.updateGenList(this.props.indx, mat);
    };

    trackLengthText(e) {
        if (e.target.value !== '') {
            this.setState({lengthInput: true});
        } else {
            this.setState({lengthInput: false});
        }
    }

    render() {
        const {mode} = this.props;
        const {mat} = this.props;
        console.log(`mat: ${mat}`);

        return (
            <Container className='light'
                       onDragStart={(event) => this.onDragStart(event, mat)}
                       draggable={mode === 'card'}
                       style={this.styles('background')}
                       onDragOver={(event) => {
                           this.onDragOver(event)
                       }}
                       onDrop={(event) => {
                           this.onDrop(event, "entry")
                       }}>
                <Row style={this.styles('titlePadding')}>
                    <Col style={this.styles('titleWidth')}>
                        <p className='text-center text-darkest'
                           style={this.styles('title')}>
                            {mat.name}
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
                    mode === 'entry' ? mat.name === 'Vacuum' ?
                        <Row><Col className='col-12'><p className='d-flex justify-content-center'
                                                        style={this.styles('indicator')}>+</p></Col></Row>
                        : <Row><Col className={'d-flex justify-content-center'}><Button
                            onClick={() => this.props.genListRemove(this.props.indx)}
                            className='gray1 card-btn' style={this.styles('indicator')}>-</Button></Col></Row>
                        : mode !== 'list' ?
                        <Row><Col><span style={this.styles('indicator')}/></Col></Row>
                        : ''
                }
                {
                    mode === 'entry' && mat.name !== 'Vacuum' ?
                        <Row>
                            <Container className='m-0 p-0'>
                                {/*<br/><br/><br/>*/}
                                <Row className='m-0 p-0'>
                                    <Col className='col-1 p-0'/>
                                    <Col className='col-10 p-0'>
                                        <OverlayTrigger trigger="click" placement="right"
                                                        overlay={
                                                            <Popover id="popover-basic">
                                                                <Popover.Title as="h3">Popover right</Popover.Title>
                                                                <Popover.Content>
                                                                    And here's some <strong>amazing</strong> content.
                                                                    It's very engaging.
                                                                    right?
                                                                </Popover.Content>
                                                            </Popover>
                                                        }
                                        >
                                            <Button variant="success">Click me to see</Button>
                                        </OverlayTrigger>

                                    </Col>
                                    <Col className='col-1 p-0'/>
                                </Row>
                            </Container>
                        </Row>
                        :
                        mode === 'card' ?
                            <Row className='my-1'><Col className='text-center'><img draggable={false}
                                                                                    src={'https://mdbootstrap.com/img/svg/hamburger7.svg?color=000000'}
                                                                                    style={{
                                                                                        height: 'auto',
                                                                                        width: 'auto'
                                                                                    }}/></Col></Row>
                            : <Row><Container><br/><br/><br/></Container></Row>
                }
            </Container>
        );
    }
}

export default MatCard;