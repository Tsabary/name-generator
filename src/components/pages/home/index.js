import "./styles.scss";
import React from "react";

const Home = () => {
  return (
    <div className="home">
      <div className="home__title">
        <h1>Branding is Hard</h1>
        <h2>Create a new brand with Billie, our AI powered word generator.</h2>
        <div className="boxed-button small-margin-top">
          <a href="#sign-up">
            Start Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
