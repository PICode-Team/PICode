export const SET_CHAT_INFO = "set_chat_info" as const;

export interface TChatState {
  message: string;
  sender: string;
  time: string;
}

export const setChatInfo = (chat: TChatState) => ({
  type: SET_CHAT_INFO,
  chat: chat,
});

export type ChatAction = ReturnType<typeof setChatInfo>;

export const initialState: TChatState[] = [];

export default (state: TChatState[] = initialState, action: ChatAction) => {
  switch (action.type) {
    case SET_CHAT_INFO:
      return [...state, action.chat];
    default:
      return state;
  }
};
