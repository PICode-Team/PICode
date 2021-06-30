import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../store";
import { setToken, removeToken } from "../store/actions/tokenAction";
import { TTokenState } from "../store/types/tokenType";

interface TTokenOperators {
  token: string;
  setToken: (token: TTokenState) => void;
  removeToken: () => void;
}

export function useToken(): Readonly<TTokenOperators> {
  const dispatch = useDispatch();
  const token = useSelector((state: AppState) => state.TokenReducer.token);

  const handleSetToken = useCallback(
    (token: TTokenState) => {
      dispatch(setToken(token));
    },
    [dispatch]
  );

  const handleRemoveToken = useCallback(() => {
    dispatch(removeToken());
  }, [dispatch]);

  return {
    token: token,
    setToken: handleSetToken,
    removeToken: handleRemoveToken,
  };
}
