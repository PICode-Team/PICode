import { TTokenState, SET_TOKEN, REMOVE_TOKEN } from "../types/tokenType";

export function setToken(newToken: TTokenState) {
  return {
    type: SET_TOKEN,
    token: newToken,
  };
}

export function removeToken() {
  return {
    type: REMOVE_TOKEN,
  };
}
