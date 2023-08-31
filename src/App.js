import React from 'react';
import { BrowserRouter as Routes, Route, Switch } from 'react-router-dom';
import { checkStatus, json } from './utils';
import Navbar from './Navbar';
import Exchange from './ExchangeRates';
import Converter from './CurrencyConverter';
import Footer from './Footer';
import './App.css';

let isLoading = true;

class App extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      amount: 1,
      base: 'USD',
      rates: null,
      currencies: [],
      error: '',
    };

    this.handleExchangeChange = this.handleExchangeChange.bind(this);  
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

  handleExchangeChange (event) {
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
  
  render () {

    const { rates, currencies } = this.state;
    
    if (isLoading) {
      return(
        <div className="d-flex justify-content-center mt-5">
          <div className="spinner-border" role="status">
            <span className="sr-only"></span>
          </div>
        </div>
      )
    }

    return (
      <Routes>
        <Navbar />
          <Switch>
            <Route path="/" exact>
              <Exchange rates={rates} currencies={currencies} handleExchangeChange={this.handleExchangeChange} />
            </Route>
            <Route path="/converter">
              <Converter rates={rates} currencies={currencies} />
            </Route>
          </Switch>
        <Footer />
      </Routes>
    );
  }
}

export default App;
