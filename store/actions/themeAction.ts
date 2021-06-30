import { CHANGE_DARK, CHANGE_WHITE } from "../types/themeType";

export function changeDark() {
  return {
    type: CHANGE_DARK,
  };
}

export function changeWhite() {
  return {
    type: CHANGE_WHITE,
  };
}
