export const SET_DRAG_INFO = "set_drag_info" as const;
export const DELETE_DRAG_INFO = "delete_drag_info" as const;

export const setDragInfo = (tabInfo: TDragState) => ({
  type: SET_DRAG_INFO,
  tabInfo: tabInfo,
});

export const deleteDragInfo = () => ({
  type: DELETE_DRAG_INFO,
});

export type DragChangeAction = ReturnType<
  typeof setDragInfo | typeof deleteDragInfo
>;

export interface TDragState {
  tabId: number;
  path: string;
}

export const initialState: TDragState = {
  tabId: -1,
  path: "default",
};

export default (state: TDragState = initialState, action: DragChangeAction) => {
  switch (action.type) {
    case SET_DRAG_INFO:
      return action.tabInfo;
    case DELETE_DRAG_INFO:
      return initialState;
    default:
      return state;
  }
};
