import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <div id="footer">
      <div className="container-footer">
      <div class="footer-content d-flex flex-column flex-md-row pt-3">
          <p><small>Copyright &copy;2023 | All rights reserved.</small></p>
          <p><a href="https://jpetty-portfolio.netlify.app/" target="_blank">Portfolio</a></p>
        </div>
      </div>
    </div>
  );
}

export default Footer;