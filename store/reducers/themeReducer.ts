import {
  ThemeActionTypes,
  TThemState,
  CHANGE_DARK,
  CHANGE_WHITE,
} from "../types/themeType";

const initialState: TThemState = {
  theme: "dark",
};

export default (
  state: TThemState = initialState,
  action: ThemeActionTypes
): TThemState => {
  const { type } = action;

  switch (type) {
    case CHANGE_DARK:
      return { theme: "dark" };
    case CHANGE_WHITE:
      return { theme: "white" };
    default:
      return state;
  }
};
