import React from "react";
import "./About.css";

function About() {
  return (
    <section className="about-page">
      <div className="about-container">
        <div className="about-profile">
          <div className="profile-image-box">
            <img
              src="https://res.cloudinary.com/jwqnivpq/image/upload/v1788811385/picofme.png"
              alt="Akshay Bachhav"
            />
          </div>

          <div className="profile-info">
            <span className="profile-label">DEVELOPER</span>

            <h1>Akshay Bachhav</h1>

            <p className="profile-role">Full Stack Developer</p>

            <p className="profile-description">
              I am a passionate developer focused on building modern, responsive
              and user-friendly web applications using the MERN stack. I enjoy
              learning new technologies and turning ideas into practical digital
              experiences.
            </p>

            <div className="profile-contact">
              <div className="contact-item">
                <i className="fa-solid fa-envelope"></i>
                <span>akshaybachhav172@gmail.com</span>
              </div>

              <div className="contact-item">
                <i className="fa-solid fa-location-dot"></i>
                <span>India</span>
              </div>
            </div>

            <div className="profile-socials">
              <a
                href="https://www.linkedin.com/in/akshay-bachhav-"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <i className="fa-brands fa-linkedin-in"></i>
              </a>

              <a
                href="https://github.com/akshayb321/SnapBazaar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <i className="fa-brands fa-github"></i>
              </a>

              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=akshaybachhav172@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email"
              >
                <i className="fa-solid fa-envelope"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="about-content">
          <div className="about-heading">
            <span>ABOUT ME</span>

            <h2>
              Building Ideas Into <strong>Digital Experiences.</strong>
            </h2>
          </div>

          <p>
            I enjoy turning ideas into practical and visually appealing web
            applications. My main focus is full-stack web development, combining
            clean frontend interfaces with reliable backend functionality. I am
            continuously improving my development and problem-solving skills.
          </p>

          <div className="skills-section">
            <h3>Technical Skills</h3>

            <div className="skills-list">
              <span>HTML</span>
              <span>CSS</span>
              <span>JavaScript</span>
              <span>React</span>
              <span>Node.js</span>
              <span>Express.js</span>
              <span>MongoDB</span>
              <span>Java</span>
              <span>DSA</span>
              <span>Git</span>
            </div>
          </div>
        </div>

        <div className="project-highlight">
          <div className="project-icon">
            <i className="fa-solid fa-code"></i>
          </div>

          <div className="project-info">
            <span>MY PROJECT</span>

            <h2>SnapBazaar</h2>

            <p>
              SnapBazaar is a full-stack ecommerce platform built by me using
              the MERN stack. The project includes authentication, product
              browsing, search and filters, cart, wishlist, checkout, payment
              integration, address management and order tracking.
            </p>
          </div>
        </div>

        <div className="about-footer">
          <p>
            Designed & Developed by <strong>Akshay Bachhav</strong>
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;
