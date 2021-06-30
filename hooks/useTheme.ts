import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../store";
import { changeDark, changeWhite } from "../store/actions/themeAction";
import { TTheme } from "../store/types/themeType";

interface TThemeOperators {
  theme: TTheme;
  setTheme: (theme: TTheme) => void;
}

export function useTheme(): Readonly<TThemeOperators> {
  const dispatch = useDispatch();
  const theme = useSelector((state: AppState) => state.ThemeReducer.theme);

  const handleChangeTheme = useCallback(
    (theme: TTheme) => {
      if (theme === "dark") dispatch(changeDark());
      else dispatch(changeWhite());
    },
    [dispatch]
  );

  return {
    theme: theme,
    setTheme: handleChangeTheme,
  };
}
