import React from "react";
import "./footer.css";
function Footer() {
  return (
    <div className="footer-div">
      <div className="footer-wrapper">
        {/* <h1 className="footer-logo" href="/">
          Instavibes
        </h1> */}
        <ul className="footer-ul">
          <li>
            <img src="/images/tony.png">
            </img>
            <a href="https://github.com/suasllc/instavibes"
              className="footer-a">
              Tony
            </a>
          </li>
          <li>
            <img src="/images/daniel.png">
            </img>
            <a href="https://github.com/suasllc/instavibes"
              className="footer-a">
              Daniel
            </a>
          </li>
          <li>
            <img src="/images/Selfie.jpg">
            </img>
            <a href="https://github.com/suasllc/instavibes"
              className="footer-a">
              Michael
            </a>
          </li>
          <li>
            <img src="/images/adam.jpg">
            </img>
            <a href="https://github.com/suasllc/instavibes"
              className="footer-a">
              Adam
            </a>
          </li>
        </ul>
      </div>
    </div >
  );
}

export default Footer;
