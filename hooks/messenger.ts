import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TMessengerState } from "../modules/messenger";
import { RootState } from "../modules";
import { setMessengerInfo } from "../modules/messenger";

interface TChatOperators {
  messenger: TMessengerState;
  setMessenger: (messengerInfo: TMessengerState) => void;
}

export function useMessenger(): Readonly<TChatOperators> {
  const dispatch = useDispatch();
  const messenger = useSelector((state: RootState) => state.messenger);

  const handleSetMessengerState = useCallback(
    (newMessenger: TMessengerState) => {
      dispatch(setMessengerInfo(newMessenger));
    },
    [dispatch]
  );

  return {
    messenger: messenger,
    setMessenger: handleSetMessengerState,
  };
}
