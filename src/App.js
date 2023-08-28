import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './Navbar';
import './App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
    </Router>
  );
}

export default App;
