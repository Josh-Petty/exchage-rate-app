import React, { useState } from 'react';
import { checkStatus, json } from './utils';
import './ExchangeRates.css';

let isLoading = true;

class Exchange extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      amount: 1,
      base: 'USD',
      rates: null,
      currencies: [],
      error: '',
    };

    this.handleChange = this.handleChange.bind(this);  
    this.getRates = this.getRates.bind(this);
  }

  componentDidMount () {
    const { base } = this.state;
    fetch(`https://api.frankfurter.app/currencies`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        if (!data) {
          throw new Error(data.Error);
        }

        if (data) {
          this.setState({ currencies: Object.keys(data), error: '' });
        }
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.log(error);
      })
      
    this.getRates(base);  
  }

  handleChange (event) {
    this.setState({
      base: event.target.value
    }, () => {
      this.getRates(this.state.base);
    });
  }

  getRates (base) {
    fetch(`https://api.frankfurter.app/latest?from=${base}`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        console.log(data);
        if (!data) {
          throw new Error(data.Error);
        }

        if (data) {
          this.setState({ rates: Object.entries(data.rates), error: '' })
          isLoading = false;
        }
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.log(error);
      })
  }

  render() {
    const { rates, currencies } = this.state;

    while (isLoading) {
      return(
        <div className="d-flex justify-content-center mt-5">
          <div className="spinner-border" role="status">
            <span className="sr-only"></span>
          </div>
        </div>
      )
    }

    return(
      <div className="container-fluid mx-0 px-0">
        <div className="color-bar">
          <h3 className="section-title text-center mb-0">Current Exchange Rates</h3>
        </div>
        <div className="content-container">
          <div className="row">
            <div className="col-6">
              <h5 className="text-center label pt-3 mb-5">Currency</h5>
            </div>
            <div className="col-6">
              <h5 className="text-center label pt-3 mb-5">Amount</h5>
            </div>
          </div>
          <form className="row">
            <div className="col-6">
              <select className="form-select mx-auto" id="currencySelect" onChange={this.handleChange}>
                <option defaultValue="USD">USD</option>
                {currencies.map((item, id) => (
                  <option key={id}>{item}</option>
                ))}
              </select>
            </div>
            <div className="col-6">
              <h5 className="text-center label">1</h5>
            </div>
          </form>
          {rates.map((item, id) => (
            <div className="row mt-2" key={id}>
              <div className="col-6">
                <h5 className="text-center">{item[0]}</h5>
              </div>
              <div className="col-6">
                <h5 className="text-center">{item[1]}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }


}

export default Exchange;