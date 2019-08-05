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
import {noop} from "@babel/types";

class MatCard extends Component {
    constructor(props) {
        super(props);
        this.state = {lengthInput: false, min: '', max: '', part: '', showMore: false};
        this.styles = this.styles.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.trackLengthText = this.trackLengthText.bind(this);
        this.setLength = this.setLength.bind(this);
        this.expandLenInput = this.expandLenInput.bind(this);
    }

    styles(element) {
        switch (element) {
            case 'dragging':
                switch (this.props.mode) {
                    case 'entry':
                        return {outline: '1px dashed #000000', width: '120px'};
                    case 'card' :
                        return this.props.mat.name === 'vacuum' ? {display: 'none'} :
                            {
                                background: 'light',
                                border: '1px solid gray',
                                // width: '60px',
                                boxShadow: '0 1px 4px 2px rgba(0,0,0,0.25)',
                                opacity: 0.5
                            };
                    case 'list':
                        return this.props.mat.name === 'vacuum' ? {display: 'none'} :
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
                            outline: this.props.mat.name === 'vacuum' ? '1px dashed #000000' : '1px solid #000000',
                            width: '120px'
                        };
                    case 'card' :
                        return this.props.mat.name === 'vacuum' ? {display: 'none'} :
                            {
                                background: 'light',
                                border: '1px solid gray',
                                // width: '60px',
                                boxShadow: '0 1px 4px 2px rgba(0,0,0,0.25)'
                            };
                    case 'list':
                        return this.props.mat.name === 'vacuum' ? {display: 'none'} :
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
                        return (this.props.mat.name === 'vacuum' ? {fontSize: '100px', color: 'black'} :
                            {
                                fontSize: '100px',
                                color: this.props.mat.color,
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
                            height: '15px',
                            width: '15px',
                            margin: 'auto',
                            padding: '0',
                            background: `${this.props.mat.color}`,
                            borderRadius: '50%',
                            display: 'block',
                        };
                    case 'list':
                        return {
                            height: '10px',
                            width: '10px',
                            margin: '0',
                            padding: '0',
                            background: `${this.props.mat.color}`,
                            borderRadius: '50%',
                            display: 'inline-flex',
                            verticalAlign: 'middle'
                        };
                    default:
                        return {};
                }
            default:
                return null;
        }
    }

    onDragStart = (event, mat) => {
        event.dataTransfer.setData("mat", JSON.stringify(mat));
    };

    onDragOver = (event) => {
        event.preventDefault();
    };

    onDrop = (event, mode) => {
        event.preventDefault();
        let mat = JSON.parse(event.dataTransfer.getData("mat"));
        this.props.updateGenList(this.props.indx, mat);
    };

    trackLengthText(e) {
        if (e.target.value !== '') {
            this.setState({lengthInput: true});
        } else {
            this.setState({lengthInput: false});
        }
    }

    expandLenInput() {
        let shallow = this.props.len;
        let lenTemp = {single: shallow.single, min: shallow.min, max: shallow.max, part: shallow.part};
        lenTemp.single = false;
        this.props.updateGenList(this.props.indx, this.props.mat, lenTemp)
        this.setState({showMore: true})
    }

    setLength(e, inputField) {
        console.log(this.props);
        let shallow = this.props.len;
        let lenTemp = {single: shallow.single, min: shallow.min, max: shallow.max, part: shallow.part};
        switch (inputField) {
            case 1:
                lenTemp.min = e.target.value;
                this.setState({min: e.target.value});
                break;
            case 2:
                lenTemp.max = e.target.value;
                lenTemp.single = false;
                this.setState({min: e.target.value});
                break;
            case 3:
                lenTemp.part = e.target.value;
                lenTemp.single = false;
                this.setState({min: e.target.value});
                break;
            default:
                noop();
                break;
        }
        this.props.updateGenList(this.props.indx, this.props.mat, lenTemp)
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props.mode !== 'card';
    }

    render() {
        const {mode} = this.props;
        const {mat} = this.props;
        console.log('MatCard---\nprops:', this.props);

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
                            {mat.name !== 'vacuum' ? mat.name : ''}
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
                    mode === 'entry' ? mat.name === 'vacuum' ?
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
                    mode === 'entry' && mat.name !== 'vacuum' ?
                        <Row>
                            <Container className='m-0 p-0'>
                                {/*<br/><br/><br/>*/}
                                <Row className='m-0 p-0'>
                                    <Col className='col-1 p-0'/>
                                    <Col className='col-10 p-0'>
                                        <Form.Group>
                                            <InputGroup>
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text className={'p-1'}
                                                                     id="lenPrepend1">{this.state.showMore ? 'Min:' : 'Len:'}</InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control
                                                    // className={'m-0 p-0'}
                                                    className={'p-1'}
                                                    type="text"
                                                    placeholder="10"
                                                    aria-describedby="lenPrepend1"
                                                    name="len1"
                                                    onChange={(e) => this.setLength(e, 1)}
                                                    value={this.props.len.min}
                                                    // isInvalid={!!errors.username}
                                                />
                                                {/*<Form.Control.Feedback type="invalid">*/}
                                                {/*    {errors.username}*/}
                                                {/*</Form.Control.Feedback>*/}
                                            </InputGroup>
                                            {this.state.showMore ?
                                                <Form.Group>
                                                    <InputGroup>
                                                        <InputGroup.Prepend>
                                                            <InputGroup.Text className={'p-1'}
                                                                             id="lenPrepend1">Max:</InputGroup.Text>
                                                        </InputGroup.Prepend>
                                                        <Form.Control
                                                            className={'p-1'}
                                                            type="text"
                                                            placeholder="10"
                                                            aria-describedby="lenPrepend1"
                                                            name="len1"
                                                            onChange={(e) => this.setLength(e, 2)}
                                                            value={this.props.len.max}
                                                            // isInvalid={!!errors.username}
                                                        />
                                                        {/*<Form.Control.Feedback type="invalid">*/}
                                                        {/*    {errors.username}*/}
                                                        {/*</Form.Control.Feedback>*/}
                                                    </InputGroup>
                                                    <InputGroup>
                                                        <InputGroup.Prepend>
                                                            <InputGroup.Text className={'p-1'}
                                                                             id="lenPrepend1">Part:</InputGroup.Text>
                                                        </InputGroup.Prepend>
                                                        <Form.Control
                                                            className={'p-1'}
                                                            type="text"
                                                            placeholder="10"
                                                            aria-describedby="lenPrepend1"
                                                            name="len1"
                                                            onChange={(e) => this.setLength(e, 3)}
                                                            value={this.props.len.part}
                                                            // isInvalid={!!errors.username}
                                                        />
                                                        {/*<Form.Control.Feedback type="invalid">*/}
                                                        {/*    {errors.username}*/}
                                                        {/*</Form.Control.Feedback>*/}
                                                    </InputGroup>
                                                </Form.Group>
                                                :
                                                <Button onClick={() => this.expandLenInput()}>Range</Button>
                                            }
                                        </Form.Group>
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
                                                                                        height: '20px',
                                                                                        width: '20px'
                                                                                    }}/></Col></Row>
                            : mode === 'list' ? '' : <Row><Container><br/><br/><br/></Container></Row>
                }
            </Container>
        );
    }
}

export default MatCard;