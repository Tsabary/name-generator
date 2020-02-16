import "./styles.scss";
import React, { useContext, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { fetchProjects, setCurrentPage } from "../../../../actions";
import { AuthContext } from "../../../../providers/Auth";

const ProjectBrowser = ({ projects, fetchProjects, setCurrentPage }) => {
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    
    setCurrentPage('studio')
    if (!!currentUser) fetchProjects(currentUser);
  }, [currentUser]);

  const renderProjects = () => {
    return !!projects
      ? projects.map(project => {
          return (
            <Link
              to={`/studio/${project.id}`}
              className="project-option"
              key={project.id}
            >
              <div className="project-option__title">{project.title}</div>
              <div className="project-option__description tiny-margin-top">
                {project.description}
              </div>
              <div className="project-option__members tiny-margin-top">
                {project.team.length}{" "}
                {project.team.length === 1 ? "member" : "members"}
              </div>
            </Link>
          );
        })
      : null;
  };

  return (
    <div className="project-browser">
      <div className="project-option project-option__button">
        <a
          href="#new-project"
          className=" project-option__title project-option__button-text centered-text"
        >
          <div className="vertical-align">Create a new project</div>
        </a>{" "}
      </div>
      {!!projects.length ? renderProjects() : null}
    </div>
  );
};
const mapStateToProps = state => {
  return {
    projects: state.projects
  };
};

export default connect(mapStateToProps, { setCurrentPage, fetchProjects })(ProjectBrowser);
