import { createTheme } from "@material-ui/core/styles";

export interface IThemeStyle {
  backgroundColor: {
    step0: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
  };
  font: {
    [key: string]: {
      color: string;
      size: string;
    };
  };
  button: string;
  editor: {
    divider: string;
    tab: string;
    tabbar: string;
    path: string;
    active: string;
    drag: {
      code: string;
      tab: string;
      tabbar: string;
      emptyCode: string;
    };
  };
}

export const darkTheme = createTheme({
  backgroundColor: {
    step0: "#192428",
    step1: "#2D383C",
    step2: "#414C50",
    step3: "#515C60",
    step4: "#626262",
  },
  button: "#192428",
  font: {
    high: {
      color: "#f6f6f6",
      size: "30px",
    },
    medium: {
      color: "#eaeaea",
      size: "24px",
    },
    low: {
      color: "#D5D5D5",
      size: "18px",
    },
    small: {
      color: "#D5D5D5",
      size: "12px",
    },
  },
  editor: {
    divider: "#ababab",
    tab: "#404040",
    tabbar: "#3a4145",
    path: "#1E1E1E",
    active: "#1E1E1E",
    drag: {
      code: "#ffffff",
      tab: "rgba(30,30,30, 0.65) !important",
      tabbar: "rgba(58,65,69, 0.65) !important",
      emptyCode: "#3A4447",
    },
  },
} as any);

export const whiteTheme = createTheme({
  backgroundColor: {
    step0: "#ffffff",
    step1: "#F3F3F3  ",
    step2: "#DDDDDD  ",
    step3: "#C6C6C6",
    step4: "#ECECEC ",
  },
  button: "#C6C6C6",
  font: {
    high: {
      color: "#000000",
      size: "30px",
    },
    medium: {
      color: "#121212",
      size: "24px",
    },
    low: {
      color: "#414C50",
      size: "18px",
    },
    small: {
      color: "#343434",
      size: "12px",
    },
  },
  editor: {
    divider: "4a4a4a",
    tab: "#ECECEC",
    tabbar: "#F3F3F3",
    path: "#ffffff",
    active: "#ffffff",
    drag: {
      code: "rgba(150, 150, 150, 1)",
      tab: "rgba(225, 225, 225, 0.9) !important",
      tabbar: "rgba(58, 65, 69, 0.05) !important",
      emptyCode: "rgba(225, 225, 225, 0.9)",
    },
  },
} as any);
