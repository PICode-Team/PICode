import { useDispatch, useSelector } from "react-redux";
import { toDark, toWhite } from "../modules/theme";

export const useThemeData = () => {
    const theme = useSelector((state: any) => state.theme);
    const dispatch = useDispatch();

    return {
        data: theme,
    };
};
