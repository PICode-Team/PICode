import { TTab, TCode, TEditorRoot } from "../components/service/code/types";

export const SET_CODE_STATE = "set_code_state" as const;

export const setCodeState = (code: TEditorRoot) => {
  return {
    type: SET_CODE_STATE,
    code: code,
  };
};

export type CodeAction = ReturnType<typeof setCodeState>;

const initialState: TEditorRoot = {
  codeOrderStack: [],
  tabCount: 0,
  codeCount: 0,
  vertical: false,
  root: [],
};

export default (
  state: TEditorRoot = initialState,
  action: CodeAction
): TEditorRoot => {
  const { type, code } = action;

  switch (type) {
    case SET_CODE_STATE:
      return code;
    default:
      return state;
  }
};
