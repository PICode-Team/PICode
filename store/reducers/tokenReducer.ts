import {
  TokenActionTypes,
  TTokenState,
  STORE_TOKEN,
  DELETE_TOKEN,
} from "../types/tokenType";

const initialState: TTokenState = {
  token: "",
};

export default (
  state: TTokenState = initialState,
  action: TokenActionTypes
): TTokenState => {
  switch (action.type) {
    case STORE_TOKEN:
      return { token: action.token };
    case DELETE_TOKEN:
      return { token: "" };
    default:
      return state;
  }
};
