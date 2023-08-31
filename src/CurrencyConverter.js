import React from 'react';
import fx from 'money';
import Chart from 'chart.js/auto';
import { checkStatus, json } from './utils';
import './CurrencyConverter.css';

let timeout;

class Converter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: '1.00',
      from: this.props.base,
      to: 'EUR',
      converted: 1,
      inverted: 1,
    }

    this.chartRef = React.createRef();
    this.amountChange = this.amountChange.bind(this);
    this.fromChange = this.fromChange.bind(this);
    this.toChange = this.toChange.bind(this);
  }

  componentDidMount () {
    this.props.rates.map(item => {
      fx.rates[item[0]] = item[1];
    })
    fx.rates[this.state.from] = 1;
    fx.base = this.props.base;
    fx.settings = { from: this.state.from, to: 'EUR' };
    this.convert(this.state.amount, this.state.from, this.state.to);

    this.getHistory();
  }

  amountChange (event) {
    clearTimeout(timeout);
    const element = document.getElementById("amountInput");
    const input = event.target.value;
    let original = String(input);
    let splitArray = original.split('.');
    let whole = splitArray[0];
    let change;
    if (splitArray.length < 2) {
      change = "00";
    } else if (splitArray[1].length < 2) {
      change = splitArray[1] + '0';
    } else {
      change = splitArray[1];
    }

    let newAmount = `${whole}.${change}`;
    this.setState({ amount: newAmount });
    timeout = setTimeout(() => { this.convert(this.state.amount, this.state.from, this.state.to), 1000 });
  }

  fromChange (event) {
    this.setState({ from: event.target.value }, () => {
      this.convert(this.state.amount, this.state.from, this.state.to);
      this.getHistory();
    });
  }

  toChange (event) {
    this.setState({ to: event.target.value}, () => {
      this.convert(this.state.amount, this.state.from, this.state.to);
      this.getHistory();
    });
  }

  convert (amount, from, to) {
    let convertedAmount = fx(parseFloat(amount)).from(from).to(to).toFixed(2);
    let invertedAmount = fx(parseFloat(amount)).from(to).to(from).toFixed(2);
    this.setState({ converted: convertedAmount, inverted: invertedAmount });
  }

  getHistory () {
    const startDate = new Date((new Date).getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

    fetch(`https://api.frankfurter.app/${startDate}..?from=${this.state.from}&to=${this.state.to}`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }

        const chartDates = Object.keys(data.rates);
        const chartRates = Object.values(data.rates).map(data => data[this.state.to]);
        const chartLabel = `${this.state.from}/${this.state.to}`;
        this.buildChart(chartDates, chartRates, chartLabel);
      })
      .catch(error => console.error(error.message));
  }

  buildChart (dates, rates, label) {
    const chartRef = this.chartRef.current.getContext("2d");

    if (typeof this.chart !== "undefined") {
      this.chart.destroy();
    }

    this.chart = new Chart(this.chartRef.current.getContext("2d"), {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: label,
            data: rates,
            fill: false,
            tension: 0,
          }
        ]
      },
      options: {
        responsive: true,
        layout: {
          padding: 20,
        }
      }
    })
  }

  render () {
    return (
      <div className="container-fluid mx-0 px-0">
        <div className="color-bar">
          <h3 className="section-title text-center mb-0">Currency Converter</h3>
        </div>
        <div className="content-container-currency">
          <div className="row mx-0 label-row">
            <div className="col-12 col-sm-4">
              <h5 className="label pt-3">Amount</h5>
              <input id="amountInput" className="form-control label" type="number" defaultValue="1.00" onChange={this.amountChange} />
            </div>
            <div className="col-12 col-sm-4">
              <h5 className="label pt-3">From</h5>
              <select id="fromSelect" className="form-select label" onChange={this.fromChange}>
                <option defaultValue={this.state.from}>{this.state.from}</option>
                {this.props.currencies.map((item, id) => (
                  <option key={id}>{item}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-sm-4">
              <h5 className="label pt-3">To</h5>
              <select id="toSelect" className="form-select label" onChange={this.toChange}>
                <option defaultValue="EUR">EUR</option>
                {this.props.currencies.map((item, id) => (
                  <option key={id}>{item}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="output-container">
            <div className="row">
              <div className="col-12">
                <h5 className="output-label">{this.state.amount} {this.state.from} =</h5>
              </div>
              <div className="col-12">
                <h3 className="converted-label">{this.state.converted} {this.state.to}</h3>
              </div>
              <div className="col-12">
                <h5 className="output-label">{this.state.amount} {this.state.to} = <span className="converted-label">{this.state.inverted} {this.state.from}</span></h5>
              </div>
            </div>
          </div>
        </div>
        <div className="chart-container">
          <canvas ref={this.chartRef} />
        </div>
      </div>
    )
  }
}

export default Converter;