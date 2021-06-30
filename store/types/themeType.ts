export interface TThemState {
  theme: TTheme;
}

export type TTheme = "dark" | "white";

export const CHANGE_DARK = "CHANGE_DARK";
export const CHANGE_WHITE = "CHANGE_WHITE";

interface ChangeDarkAction {
  type: typeof CHANGE_DARK;
}

interface ChangeWhiteAction {
  type: typeof CHANGE_WHITE;
}

export type ThemeActionTypes = ChangeDarkAction | ChangeWhiteAction;
