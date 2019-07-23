import React, {Component} from 'react';
import {Container} from 'react-bootstrap';

class SystemPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // sizes: ['375px', '300px', '225px', '150px'],
            sizes: ['150px','225px','300px','375px'],
            colors: ['blue1', 'blue3', 'blue5', 'blue7']
        };
        this.shellGen = this.shellGen.bind(this);
    }

    shellGen(MatList, indx) {
        console.log(MatList.length,indx)
        let output;
        if (indx === 0) {
            output = <Container className='light my-0 p-0'
                                style={{
                                    width: '75px',
                                    height: '75px',
                                    verticalAlign: 'middle',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '50%',
                                    boxShadow: '0 0 5px 2px rgba(0,0,0,0.25) inset',
                                    border: '1px solid black'
                                }}>
            </Container>
        } else {
            output = <Container className={`${this.props.matlist[indx-1].color} my-0 p-0`}
                                style={{
                                    width: this.state.sizes[indx-1],
                                    height: this.state.sizes[indx-1],
                                    verticalAlign: 'middle',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '50%',
                                    boxShadow: '0 0 5px 2px rgba(0,0,0,0.25) inset',
                                    border: '1px solid black'
                                }}
                                key={indx}>
                {this.shellGen(MatList,(indx-1))}
            </Container>
        }
        return output
    }

    render() {
        return (
            <Container className='blue9 my-0 p-0'
                       style={{
                           width: '400px',
                           height: '400px',
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           marginLeft: 'auto !important',
                           marginRight: '0',
                           boxShadow: '0 0 5px 2px rgba(0,0,0,0.25) inset',
                           border: '1px solid black'
                       }}>
                {this.props.matlist[0].mat ? this.shellGen(this.props.matlist, this.props.matlist.length) : ''}
            </Container>
        );
    }
}

export default SystemPreview;
