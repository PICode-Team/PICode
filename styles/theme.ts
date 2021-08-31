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
    loginBackground: string;
    hover: string;
    scroll: {
        bar: string;
        thumb: string;
        track: string;
    };
    divider: string;
}

export const darkTheme = createTheme({
    backgroundColor: {
        step0: "#09111B",
        step1: "#2C3239",
        step2: "#3B434D",
        step3: "#515C60",
        step4: "#626262",
    },
    loginBackground: "#1D2228",
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
    hover: "rgba(255, 255, 255, 0.1)",
    scroll: {
        bar: "#1e1e2f",
        thumb: "#555",
        track: "#1e1e2f",
    },
    divider: "rgba(255, 255, 255, 0.1)",
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
    hover: "rgba(255, 255, 255, 0.2)",
    scroll: {
        bar: "rgba(230, 230, 230, 0.3)",
        thumb: "rgba(0, 0, 0, 0.1)",
        track: "rgba(230, 230, 230, 0.3)",
    },
    divider: "rgba(220, 220, 220, 1)",
} as any);
