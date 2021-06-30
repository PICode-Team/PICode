import { createStore, applyMiddleware, Store as ReduxStore } from "redux";
import rootReducers from "./reducers";

const initialState = {};

export type Store = ReduxStore<typeof initialState>;

export type AppState = ReturnType<typeof rootReducers>;

export default function configureStore(state = initialState): Store {
  return createStore(rootReducers, state);
}
