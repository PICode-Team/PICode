import { createMuiTheme } from "@material-ui/core/styles";

export const darkTheme = createMuiTheme({
    backgroundColor: {
        step0: "#192428",
        step1: "#2D383C",
        step2: "#414C50",
        step3: "#515C60",
        step4: "#626262",
    },
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
} as any);

export const whiteTheme = createMuiTheme({
    backgroundColor: {
        step0: "#fff",
        step1: "#2D383C",
        step2: "#414C50",
        step3: "#515C60",
        step4: "#626262",
    },
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
} as any);
