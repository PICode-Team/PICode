import { combineReducers } from "redux";
import ThemeReducer from "./themeReducer";
import TokenReducer from "./tokenReducer";

const rootReducers = combineReducers({
  ThemeReducer,
  TokenReducer,
});

export default rootReducers;
