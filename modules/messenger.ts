export const SET_MESSENGER_INFO = "set_messenger_info" as const;

export interface TMessengerState {
  room: string;
}

export const setMessengerInfo = (messengerInfo: TMessengerState) => ({
  type: SET_MESSENGER_INFO,
  messengerInfo: messengerInfo,
});

export type MessengerSetAction = ReturnType<typeof setMessengerInfo>;

export const initialState: TMessengerState = {
  room: "",
};

export default (
  state: TMessengerState = initialState,
  action: MessengerSetAction
) => {
  switch (action.type) {
    case SET_MESSENGER_INFO:
      return action.messengerInfo;
    default:
      return state;
  }
};
