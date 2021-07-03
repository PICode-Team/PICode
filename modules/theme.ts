/* eslint-disable import/no-anonymous-default-export */
export const TO_DARK = "dark" as const;
export const TO_WHITE = "white" as const;

export const toDark = () => ({
    type: TO_DARK,
});

export const toWhite = () => ({
    type: TO_WHITE,
});

export type ThemeChangeAction = ReturnType<typeof toDark | typeof toWhite>;

export interface IThemeState {
    theme: string;
}

export const initialState: IThemeState = {
    theme: "dark",
};

export default (
    state: IThemeState = initialState,
    action: ThemeChangeAction
) => {
    switch (action.type) {
        case TO_DARK:
            return { theme: "dark" };
        case TO_WHITE:
            return { theme: "white" };
        default:
            return state;
    }
};
