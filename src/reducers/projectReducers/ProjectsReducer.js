import {
  FETCH_PROJECTS,
  FETCH_SINGLE_PROJECT,
  NEW_PROJECT
} from "../../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_PROJECTS:
      return action.payload;

    case FETCH_SINGLE_PROJECT:
      return [...state, action.payload];

    case NEW_PROJECT:
      return [...state, action.payload];

    default:
      return state;
  }
};
