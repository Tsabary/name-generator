import React, { useState } from "react";

export const ProjectContext = React.createContext();

export const ProjectProvider = ({ children }) => {
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState(null);

  return (
    <ProjectContext.Provider
      value={{
        currentProject,
        setCurrentProject,
        projects,
        setProjects
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
