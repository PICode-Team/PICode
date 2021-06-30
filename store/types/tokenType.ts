export interface TTokenState {
  token: string;
}

export const SET_TOKEN = "SET_TOKEN";
export const REMOVE_TOKEN = "REMOVE_TOKEN";

interface SetTokenAction {
  type: typeof SET_TOKEN;
  token: string;
}

interface RemoveTokenAction {
  type: typeof REMOVE_TOKEN;
}

export type TokenActionTypes = SetTokenAction | RemoveTokenAction;
