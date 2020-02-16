import "./styles.scss";
import React, { useContext, useState, useEffect } from "react";
import YouTube from "react-youtube";
import { AuthContext } from "../../../providers/Auth";
import { Redirect } from "react-router-dom";
import { allLetters } from "../../../constants/index";

const Home = () => {
  const [heading, setHeading] = useState("");
  const [time, setTime] = useState(0);

  const opts = {
    height: "675",
    width: "1200",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1
    }
  };

  const finalHeading = "Branding is Hard";

  useEffect(() => {
    const interval = setInterval(() => {
      const string = [];
      for (var i = 0; i < finalHeading.length; i++) {
        if (i < time) {
          string.push(finalHeading[i]);
        } else {
          string.push(
            allLetters()[
              Math.floor(Math.random() * Math.floor(allLetters().length))
            ]
          );
        }
      }
      setHeading(string.join("").substring(0, time + 2));
      setTime(time + 1);
      if (time === heading.length) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  });

  const { currentUser } = useContext(AuthContext);

  return !!currentUser ? (
    <Redirect to="/studio" />
  ) : (
    <div className="home">
      <div className="home__title">
        <h1>{heading}</h1>
        <h2>
          Use our generator to spark new ideas, brainstorm with your team, and
          keep it all in one place.
        </h2>
        {/* 
        <video autoPlay muted loop>
          <source src="https://youtu.be/sPIcw0OLjzw" />
        </video> */}
        <div className="boxed-button small-margin-top">
          <a href="#sign-up">Start Now</a>
        </div>
      </div>
      <div className="medium-margin-top medium-margin-bottom home__video centered">
        <YouTube videoId="sPIcw0OLjzw" opts={opts} />
      </div>
    </div>
  );
};

export default Home;
