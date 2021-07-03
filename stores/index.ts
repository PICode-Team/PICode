import { applyMiddleware, createStore, compose } from "redux";
import { createWrapper } from "next-redux-wrapper";
import reducer from "../modules";
import { toDark } from "../modules/theme";

const configureStore = () => {
    console.log(1, reducer(undefined, toDark()));
    const store = createStore(reducer);
    console.log(2, store.getState());
    return store;
};

const wrapper = createWrapper(configureStore, {
    debug: true,
});

export default wrapper;
