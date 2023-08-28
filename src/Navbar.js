import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () =>  {
  return (
    <nav className="navbar navbar-expand-md navbar-dark navbar-custom">
      <div className="container-fluid" id="navbarContainer">
        <Link className="navbar-brand" to="/">Exchangy</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggler"    aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarToggler">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Exchange Rates</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/converter/">Currency Converter</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;