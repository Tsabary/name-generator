import { combineReducers } from "redux";

import PageReducer from "./PageReducer";
import ProjectsReducer from "./projectReducers/ProjectsReducer";
import CurrentProjectReducer from "./projectReducers/CurrentProjectReducer";
import CurrentWordReducer from "./shufflerReducers/CurrentWordReducer";
import SavedWordsReducer from "./shufflerReducers/SavedWordsReducer";
import WordSetReducer from "./shufflerReducers/WordSetReducer";
import WordBankReducer from "./shufflerReducers/WordBankReducer";
import CommentsReducer from "./socialReducers/CommentsReducer";
import RepliesReducer from "./socialReducers/RepliesReducer";

export default combineReducers({
  page: PageReducer,
  projects: ProjectsReducer,
  currentProject: CurrentProjectReducer,
  currentWord: CurrentWordReducer,
  savedWords: SavedWordsReducer,
  wordSet: WordSetReducer,
  wordBank: WordBankReducer,
  comments: CommentsReducer,
  replies: RepliesReducer
});
