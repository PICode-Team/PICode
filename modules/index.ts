import { AnyAction, CombinedState, combineReducers } from "redux";
import { HYDRATE } from "next-redux-wrapper";
import theme, { IThemeState } from "./theme";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import code from "./code";
import drag, { TDragState } from "./drag";
import messenger, { TMessengerState } from "./messenger";
import chat, { TChatState } from "./chat";
import { TEditorRoot } from "../components/service/code/types";

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
        code,
        drag,
        messenger,
        chat,
      });
      return combineReducer(state, action);
    }
  }
};

export type RootState = ReturnType<typeof rootReducer>;
export default persistReducer(persistConfig, rootReducer);

interface IState {
  theme: IThemeState;
  code: TEditorRoot;
  drag: TDragState;
  messenger: TMessengerState;
  chat: TChatState[];
}
