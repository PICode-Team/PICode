import { AnyAction, CombinedState, combineReducers } from "redux";
import { HYDRATE } from "next-redux-wrapper";
import theme, { IThemeState } from "./theme";

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
            console.log(combineReducer(state, action));
            return combineReducer(state, action);
        }
    }
};

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;

interface IState {
    theme: IThemeState;
}
