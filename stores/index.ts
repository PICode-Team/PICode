import { createStore } from "redux";
import { createWrapper } from "next-redux-wrapper";
import reducer from "../modules";
import { persistStore } from "redux-persist";

const configureStore = () => {
    const store: any = createStore(reducer);
    store.__persistor = persistStore(store);
    return store;
};

const wrapper = createWrapper(configureStore, {
    debug: process.env.STATE === "development",
});

export default wrapper;
