import React, {Component} from 'react';
import {Chart, Bar, Line, Pie} from 'react-chartjs-2';

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
    }

    componentWillMount() {
        Chart.pluginService.register({
            filler: {propagate: true}
        });
    }

    setGradientColor = (canvas, color) => {
        const ctx = canvas.getContext("2d");
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.95, 'rgba(255,255,255,0)');
        return gradient;
    };

    getChartData = canvas => {
        const data = this.state.chartData;
        if (data.datasets) {
            let colors = ['rgba(255, 0,255,0.75', 'rgba(0, 255, 0, 0.75'];
            data.datasets.forEach((set, i) => {
                set.backgroundColor = this.setGradientColor(canvas, colors[i]);
                set.borderColor = colors[i];
                set.borderWidth = 2;
            });
            return data;
        }
    };

    render() {
        const data = (canvas) => {
        };
        return (
            <div className='chart'>
                <Line data={this.getChartData}
                      options={
                          {
                              maintainAspectRatio: false
                          }
                      }
                      width={500}
                      height={200}
                />
            </div>
        )
    }
}

export default DataChart;