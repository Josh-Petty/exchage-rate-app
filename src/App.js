import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './Navbar';
import Exchange from './ExchangeRates';
import Footer from './Footer';
import './App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Exchange />
      
    </Router>
  );
}

export default App;
