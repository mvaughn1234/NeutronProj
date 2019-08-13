import React, {Component} from 'react';
import {Chart, Bar, Line, Pie} from 'react-chartjs-2';
import logspace from "logspace";
import {Form, InputGroup} from "react-bootstrap";
import {Container, Row, Col} from 'react-bootstrap';

class DataChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: {
                labels: ['1', '2', '3', '5', '6', '7'],
                datasets: [
                    {
                        label: 'Thing1',
                        data: [12, 264, 315, 5, 58, 16, 315]
                    },
                    {
                        label: 'Thing2',
                        data: [56, 113, 153, 55, 10, 203, 8, 190]
                    }
                ]
            }
        };
        this.getChartData = this.getChartData.bind(this);
        this.setGradientColor = this.setGradientColor.bind(this);
        this.renderBins = this.renderBins.bind(this);
    }

    componentWillMount() {
        Chart.pluginService.register({
            filler: {propagate: true}
        });
    }

    renderBins(target) {
        let settings = this.props.settings;
        if (settings) {
            let min = settings.find(setting => setting.title === 'Energy Min').currentValue;
            let max = settings.find(setting => setting.title === 'Energy Max').currentValue;
            let numBins = settings.find(setting => setting.title === 'Num Bins').currentValue;
            console.log(min, max, numBins);
            let i;
            console.log('numBins: ', numBins);
            let bins = logspace(Math.log10(min), Math.log10(max), numBins);
            let list = [];
            for (i = 0; i < numBins; i++) {
                list.push(
                    //<li><FormControl type={'text'} key={i} /></li>
                    <InputGroup key={`${target}${i}`}>
                        <InputGroup.Prepend>
                            <InputGroup.Text style={{fontSize: '12px'}}>{bins[i]}</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                            id={i}
                            placeholder={'0'}
                            onChange={(e) => this.props.updateInput(e, target)}
                            value={this.props.data[i]}
                            style={{fontSize: '12px'}}
                        />
                    </InputGroup>
                )
            }
            return list;
        }
    }

    setGradientColor = (canvas, color) => {
        const ctx = canvas.getContext("2d");
        const {height: graphHeight} = canvas
        const gradient = ctx.createLinearGradient(0, 0, 0, graphHeight);
        gradient.addColorStop(0, color[0]);
        gradient.addColorStop(0.5, color[1]);
        gradient.addColorStop(1, color[2]);
        return gradient;
    };

    getChartData = canvas => {
        let settings = this.props.settings;
        if (settings) {
            let min = settings.find(setting => setting.title === 'Energy Min').currentValue;
            let max = settings.find(setting => setting.title === 'Energy Max').currentValue;
            let numBins = settings.find(setting => setting.title === 'Num Bins').currentValue;
            const data = Object.assign(this.props.data);
            const labels = logspace(Math.log10((min*(10**-3))), Math.log10(max), numBins);
            let datasets = [{
                label: 'Goal',
                data: this.props.data[0].map(elem => elem/this.props.data[0].reduce((acc,cur) => acc+cur, 0),0)
            }, {
                label: 'Current',
                data: this.props.data[1]
            }];
            const labels2 = labels.map(label => String(label).substr(0, 5));
            let chartData = {labels: labels2, datasets: datasets};
            console.log(chartData);
            if (chartData.datasets) {
                let colors = [['rgba(0, 255, 0, 1.0'],
                    ['rgba(255, 0, 255, 0.85',
                        'rgba(255, 0, 255, 0.2',
                        'rgba(255, 0, 255, 0.1',
                        'rgba(255, 0, 255, 1.0']];
                chartData.datasets.forEach((set, i) => {
                    if (set.label === 'Goal'){
                        set.borderDash = [10,5]
                        set.borderColor = colors[i][0];
                        set.pointBackgroundColor = 'rgba(0,0,0,0)';
                        set.pointBorderColor = 'rgba(0,0,0,0)';
                        set.pointHighlightFill = 'rgba(0,0,0,0)';
                        set.pointHighlightStroke = 'rgba(0,0,0,0)';
                        // set.borderWidth = 0;
                    }else{
                        set.backgroundColor = this.setGradientColor(canvas, colors[i]);
                        set.borderColor = colors[i][4];
                        set.pointBackgroundColor = 'rgba(0,0,0,0)';
                        set.pointBorderColor = 'rgba(0,0,0,0)';
                        set.pointHighlightFill = 'rgba(0,0,0,0)';
                        set.pointHighlightStroke = 'rgba(0,0,0,0)';
                        set.borderWidth = 5;
                    }
                });
                return chartData;
            }
        }
    };

    render() {
        const data = (canvas) => {
        };
        return (
            <Container className='chart'>
                {this.props.type === 'output' ?
                    <Line data={this.getChartData} width={50} height={300}
                          options={
                              {
                                  maintainAspectRatio: false,
                                  responsive: true,

                              }
                          }
                    />
                    :
                    this.renderBins(this.props.type)
                }
            </Container>
        )
    }
}

export default DataChart;