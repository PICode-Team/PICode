import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TEditorRoot } from "../components/service/code/types";
import { RootState } from "../modules";
import { setCodeState } from "../modules/code";

interface TCodeOperators {
  code: TEditorRoot;
  setCode: (code: TEditorRoot) => void;
}

export function useCode(): Readonly<TCodeOperators> {
  const dispatch = useDispatch();
  const code = useSelector((state: RootState) => state.code);

  const handleSetEditorState = useCallback(
    (newCode: TEditorRoot) => {
      dispatch(setCodeState(newCode));
    },
    [dispatch]
  );

  return {
    code: code,
    setCode: handleSetEditorState,
  };
}
