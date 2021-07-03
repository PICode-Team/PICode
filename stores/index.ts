import { createStore } from "redux";
import { createWrapper } from "next-redux-wrapper";
import reducer from "../modules";

const configureStore = () => {
    const store = createStore(reducer);
    return store;
};

const wrapper = createWrapper(configureStore, {
    debug: process.env.STATE === "development",
});

export default wrapper;
