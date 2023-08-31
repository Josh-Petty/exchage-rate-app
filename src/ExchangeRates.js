import React from 'react';
import './ExchangeRates.css';
class Exchange extends React.Component {

  render() {
  
    return(
      <div className="container-fluid mx-0 px-0">
        <div className="color-bar">
          <h3 className="section-title text-center mb-0">Currency Converter</h3>
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
              <select className="form-select mx-auto" id="currencySelect" onChange={this.props.handleChange}>
                <option defaultValue="USD">USD</option>
                {this.props.currencies.map((item, id) => (
                  <option key={id}>{item}</option>
                ))}
              </select>
            </div>
            <div className="col-6">
              <h5 className="text-center label">1</h5>
            </div>
          </form>
          {this.props.rates.map((item, id) => (
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