import React, {Component} from 'react';
import {Container, Row, Col, FormControl} from "react-bootstrap";
import MatCard from "../Components/MatCard/MatCard";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import {
    FormGroup,
    FormLabel,
    FormText,
    Form,
    ButtonGroup,
    Button,
    InputGroup,
    ToggleButtonGroup,
    ToggleButton,
    ButtonToolbar
} from "react-bootstrap";
import {CardColumns, Card} from 'react-bootstrap';
import axios from 'axios';

class SetProperties extends Component {
    constructor(props) {
        super(props);
        this.renderSettingInput = this.renderSettingInput.bind(this);
    }

    // constructor(props) {
    //     super(props);
    //     // this.state = {props: {matList: [''], settings: ['']}};
    // }

    // componentDidMount() {
    //     axios.get('/props').then(res => res.data).then(data => data[0] ? this.setProps(data[0]) : this.createProps());
    // }

    renderSettingInput(setting) {
        switch (setting.input) {
            case 'Button':
                return (
                    <ToggleButtonGroup type='radio' name='options' defaultValue={setting.currentValue}>
                        {setting.options.map((option, id2) =>
                            <ToggleButton key={id2} value={option}>{option}</ToggleButton>
                        )}
                    </ToggleButtonGroup>
                );
            case 'Path':
                return (
                    <FormGroup className='text-white w-auto'>
                        <InputGroup className="mb-3">
                            <FormControl className={setting.input} placeholder={setting.currentValue}/>
                            <InputGroup.Append>
                                <Button variant="outline-secondary"
                                        className='blue6 text-white'>Browse</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </FormGroup>
                );
            case 'energy1':
                return (
                    <FormGroup className='text-white w-auto'>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>KeV</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl type={'number'} placeholder={setting.currentValue}/>
                            <InputGroup.Append>
                                <Button variant="outline-secondary"
                                    className='blue6 text-white'>Browse</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </FormGroup>
                );
            case 'energy2':
                return (
                    <FormGroup className='text-white w-auto'>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>MeV</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl type={'number'} placeholder={setting.currentValue}/>
                            <InputGroup.Append>
                                <Button variant="outline-secondary"
                                    className='blue6 text-white'>Browse</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </FormGroup>
                );
            default:
                return (
                    <FormGroup className='text-white w-auto'>
                        <InputGroup className="mb-3">
                            <FormControl className={setting.input} placeholder={setting.currentValue}/>
                            <InputGroup.Append>
                                <Button variant="outline-secondary"
                                        className='blue6 text-white'>Update</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </FormGroup>
                );
            // case 'Number':
            //     return(
            //     );
            // case 'Path':
            // default:
        }
    }


    render() {
        return (
            <Container fluid className='m-0 p-0'>
                <Row>
                    <Container className='pt-5 pb-5 px-auto gray1' style={{width: '100%'}}>
                        <Row>
                            <Col className='d-block text-center col-4'>
                                <p className='textblack m-0 p-0'
                                   style={{fontSize: '40px', fontFamily: 'Montserrat'}}>Materials List</p>
                                <Container className='d-flex my-0 justify-content-center'>
                                    <FormGroup className='m-0 p-0' style={{width: 'auto'}}>
                                        <Button size='lg' className='blue6 text-white' style={{
                                            border: '1px solid #1e1e2f',
                                            boxShadow: '2px 2px 5px 2px rgba(0,0,0,0.35)'
                                        }}>Create New Material</Button>
                                    </FormGroup>
                                </Container>
                            </Col>
                            <Col>
                                <Container className='p-0 m-0 white disableScrollBar'
                                           style={{
                                               borderRadius: '2px',
                                               border: '1px solid #ffffff',
                                               minHeight: '100px',
                                               maxHeight: '200px',
                                               overflow: 'auto',
                                           }}>
                                    <ListGroup className='p-0 m-0 list-group-flush'>
                                        {this.props.global.settings.matList ? this.props.global.settings.matList.length > 0 ?
                                            this.props.global.settings.matList.map((mat, index) =>
                                                mat.name !== 'Vacuum' ?
                                                    <li className='mx-1 my-1 list-unstyled d-flex align-items-stretch'
                                                        key={index}><MatCard
                                                        mat={mat} mode={'list'} updateGenList={this.updateGenList}/>
                                                    </li>
                                                    : ''
                                            )
                                            : ''

                                            : ''}                                    </ListGroup>
                                </Container>
                            </Col>
                        </Row>
                    </Container>
                </Row>
                <Row>
                    <Container className='p-3 darker'>
                        <Container className='m-0 p-0 disableScrollBar' style={{maxHeight: '400px', overflow: 'auto', border: '1px solid black'}}>
                            <CardColumns className='white p-2' style={{
                                boxShadow: '0 0 5px 3px rgba(0,0,0,0.3) inset',
                                border: '1px solid black'
                            }}>
                                {console.log(this.props.global.settings.settings)}
                                {this.props.global.settings ? this.props.global.settings.settings ? this.props.global.settings.settings.length > 0 ? this.props.global.settings.settings.map((setting, id) =>
                                        <Card className='dark text-white' key={id}>
                                            <Card.Body>
                                                <Card.Title>{setting.title}</Card.Title>
                                                <Card.Text>{setting.description}</Card.Text>
                                                <FormGroup>
                                                    {this.renderSettingInput(setting)}
                                                </FormGroup>
                                            </Card.Body>
                                        </Card>
                                    ) : ''
                                    : '' : ''
                                }
                            </CardColumns>
                        </Container>
                    </Container>
                </Row>
                <Row>
                    <Container className='gray1 pt-3 pb-3'>
                        <Row>
                            <Col>
                                <Form>
                                    <FormGroup className='text-white'>
                                        <InputGroup className="mb-3">
                                            <FormControl placeholder="File Path"/>
                                            <InputGroup.Append>
                                                <Button variant="outline-secondary"
                                                        className='blue6 text-white'>Browse</Button>
                                            </InputGroup.Append>
                                        </InputGroup>
                                        <Button className='blue6 btn-md'>Load Setting File</Button>
                                    </FormGroup>
                                </Form>
                            </Col>
                            <Col>
                                <Form>
                                    <FormGroup className='text-white'>
                                        <FormControl className='mb-3' type='text' placeholder='Setting Title'/>
                                        <Button className='blue6 btn-md p-auto m-auto'>Save Settings</Button>
                                    </FormGroup>
                                </Form>
                            </Col>
                        </Row>
                    </Container>
                </Row>
            </Container>
        );
    }
}

export default SetProperties;