import React from 'react';

const Footer = () => {
  return (
    <footer className="gov-footer mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5>About Portal</h5>
            <p className="small">This portal is established for the mandatory registration and environmental monitoring of industries under the Air (Prevention and Control of Pollution) Act.</p>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled small">
              <li><a href="#">Ministry of Environment</a></li>
              <li><a href="#">Central Pollution Control Board</a></li>
              <li><a href="#">Guidelines for Industries</a></li>
              <li><a href="#">Help & Support</a></li>
            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Contact Us</h5>
            <p className="small">
              Indira Paryavaran Bhavan,<br/>
              Jorbagh Road, New Delhi - 110 003<br/>
              Email: support-aqi@gov.in
            </p>
          </div>
        </div>
        <hr className="bg-secondary" />
        <div className="text-center small mt-3">
          <p className="mb-0">Content Owned, Maintained and Updated by Ministry of Environment, Forest and Climate Change, Government of India.</p>
          <p className="mb-0">Site designed, developed and hosted by National Informatics Centre (NIC).</p>
        </div>
      </div>
      <div className="flag-stripe-bottom mt-3"></div>
    </footer>
  );
};

export default Footer;
