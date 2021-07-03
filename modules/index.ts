import { AnyAction, CombinedState, combineReducers } from "redux";
import { HYDRATE } from "next-redux-wrapper";
import theme, { IThemeState } from "./theme";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: "root",
    storage,
    whiteList: [""],
};

const rootReducer = (
    state: IState | undefined,
    action: AnyAction
): CombinedState<IState> => {
    switch (action.type) {
        case HYDRATE:
            return { ...state, ...action.payload.theme };
        default: {
            const combineReducer = combineReducers({
                theme,
            });
            return combineReducer(state, action);
        }
    }
};

export type RootState = ReturnType<typeof rootReducer>;
export default persistReducer(persistConfig, rootReducer);

interface IState {
    theme: IThemeState;
}
