import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../modules";
import { setChatInfo, TChatState } from "../modules/chat";

interface TDragOperators {
  chat: TChatState[];
  setChat: (chat: TChatState) => void;
}

export function useChat(): Readonly<TDragOperators> {
  const dispatch = useDispatch();
  const chat = useSelector((state: RootState) => state.chat);

  const handleSetChat = useCallback(
    (newChat: TChatState) => {
      dispatch(setChatInfo(newChat));
    },
    [dispatch]
  );

  return {
    chat: chat,
    setChat: handleSetChat,
  };
}
