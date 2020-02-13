import "./styles.scss";
import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import Header from "./header";
import Global from "../styles/global";

import { AuthProvider } from "../providers/Auth";
import { ProjectProvider } from "../providers/Project";

import history from "../history";

import SignUp from "./popups/signUp";
import LogIn from "./popups/login";
import UpdateProfile from "./popups/updateProfile";
import NewProject from "./popups/newProject";

import Home from "./pages/home";
import ProjectBrowser from "./pages/generator/projectBrowser";
import Shuffler from "./pages/generator/shuffler";


const App = ({ page }) => {
  return (
    <AuthProvider>
      <ProjectProvider>
        <Router history={history}>
          <div className="app">
            <Global />
            {page == "home" ? (
              <div className="bg-video">
                <video className="bg-video__content" autoPlay muted loop>
                  <source src="../../../../imgs/video.mp4" type="video/mp4" />
                  <source src="../../../../imgs/video.webm" type="video/webm" />
                </video>
              </div>
            ) : null}

        <SignUp />
            <LogIn />
            <NewProject />
            <UpdateProfile /> 

            <Header />
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/generator" exact component={ProjectBrowser} />
              <Route path="/generator/:id" exact component={Shuffler} />
              {/* <Route path="/feed" exact component={Feed} />
              <Route path="/search" exact component={Search} />
              <Route path="/contact" exact component={Contact} />
              <Route path="/item/:id" exact component={ItemInfo} />
              <Route path="/edit-item/:id" exact component={EditItem} />
              <Route path="/new-item" exact component={NewItem} /> */}
            </Switch>
          </div>
        </Router>
      </ProjectProvider>
    </AuthProvider>
  );
};

const mapStateToProps = state => {
  return {
    page: state.page
  };
};
export default connect(mapStateToProps)(App);
