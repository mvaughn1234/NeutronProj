import React, {Component} from 'react';
import {Button, ButtonGroup} from 'react-bootstrap';

class ViewSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {view: 0}
        this.changeView = this.changeView.bind(this);
        this.BR = this.BR.bind(this);
    }

    changeView(e, view) {
        this.setState({view});
        this.props.changeView(e, view);
    }

    BR(type, indx) {
        const L = indx === 0;
        const R = indx === this.props.buttons.length - 1;
        switch (type){
            case 'full':
                // return L ? `${this.props.size} 0 0 ${this.props.size}` : R ? `0 ${this.props.size} ${this.props.size} 0` : ''
                return L ? `1.25em 0 0 1.25em` : R ? `0 1.25em 1.25em 0` : ''
            case 'bottom':
                // return L ? `${this.props.size} 0 0 ${this.props.size}` : R ? `0 ${this.props.size} ${this.props.size} 0` : ''
                return L ? `0 0 0 1.25em` : R ? `0 0 1.25em 0` : ''


        }
    }

    render() {
        return (
            <ButtonGroup>
                {
                    this.props.buttons ?
                        this.props.buttons.map((name, idx) =>
                            <Button onClick={(e) => this.changeView(e, idx)}
                                    key={idx}
                                    active={this.state.view === idx}
                                    className={`${this.state.bg} m-0 py-1 px-3`}
                                    style={{
                                        color: 'white',
                                        fontSize: this.props.size,
                                        borderRadius: this.BR(this.props.rounded,idx),
                                        // focus: this.props.bginactive,
                                        // active: this.props.bginactive,
                                        // hover: this.props.bginactive,
                                        boxShadow: this.state.view === idx ? '0 0 5px 2px rgba(0,0,0,0.25)' : 'none',
                                        border: 'none'
                                    }}>{name}</Button>
                        )
                        :
                        ''
                }
            </ButtonGroup>
        );
    }
}

export default ViewSelect;