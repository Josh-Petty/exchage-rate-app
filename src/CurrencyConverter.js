import React from 'react';
import fx from 'money';
import './CurrencyConverter.css';

let timeout;

class Converter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: '1.00',
      from: 'USD',
      to: 'EUR',
      converted: 1,
      inverted: 1,
    }

    this.amountChange = this.amountChange.bind(this);
    this.fromChange = this.fromChange.bind(this);
    this.toChange = this.toChange.bind(this);
  }

  componentDidMount () {
    this.props.rates.map(item => {
      fx.rates[item[0]] = item[1];
    })
    fx.rates['USD'] = 1;
    fx.base = 'USD';
    fx.settings = { from: 'USD', to: 'EUR' };
    this.convert(this.state.amount, this.state.from, this.state.to);
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
    this.setState({ from: event.target.value });
    clearTimeout(timeout);
    timeout = setTimeout(() => { this.convert(this.state.amount, this.state.from, this.state.to), 500 });
  }

  toChange (event) {
    this.setState({ to: event.target.value});
    clearTimeout(timeout);
    timeout = setTimeout(() => { this.convert(this.state.amount, this.state.from, this.state.to), 500 });
  }

  convert (amount, from, to) {
    let convertedAmount = fx(parseFloat(amount)).from(from).to(to).toFixed(2);
    let invertedAmount = fx(parseFloat(amount)).from(to).to(from).toFixed(2);
    this.setState({ converted: convertedAmount, inverted: invertedAmount });
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
                <option defaultValue="USD">USD</option>
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
      </div>
    )
  }
}

export default Converter;