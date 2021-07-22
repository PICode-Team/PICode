import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../modules";
import { setDragInfo, deleteDragInfo, TDragState } from "../modules/drag";

interface TDragOperators {
  drag: TDragState;
  setDragInfo: (tabInfo: TDragState) => void;
  deleteDragInfo: () => void;
}

export function useDrag(): Readonly<TDragOperators> {
  const dispatch = useDispatch();
  const drag = useSelector((state: RootState) => state.drag);

  const handleSetDragState = useCallback(
    (newTabInfo: TDragState) => {
      dispatch(setDragInfo(newTabInfo));
    },
    [dispatch]
  );

  const handleDeleteDragState = useCallback(() => {
    dispatch(deleteDragInfo());
  }, [dispatch]);

  return {
    drag: drag,
    setDragInfo: handleSetDragState,
    deleteDragInfo: handleDeleteDragState,
  };
}
