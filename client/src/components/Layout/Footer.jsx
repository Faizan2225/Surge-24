import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="footer p-10 bg-base-200 text-base-content">
        <div>
          <span className="footer-title">Services</span>
          <a className="link link-hover">Web Development</a>
          <a className="link link-hover">Mobile Apps</a>
          <a className="link link-hover">SEO Optimization</a>
        </div>
        <div>
          <span className="footer-title">Company</span>
          <a className="link link-hover">About Us</a>
          <a className="link link-hover">Careers</a>
          <a className="link link-hover">Contact</a>
        </div>
        <div>
          <span className="footer-title">Legal</span>
          <a className="link link-hover">Terms of Use</a>
          <a className="link link-hover">Privacy Policy</a>
          <a className="link link-hover">Cookie Policy</a>
        </div>
      </footer>
    </>
  );
};

export default Footer;
