import { useDispatch } from "react-redux";
import Login from "../components/service/login";
import { toWhite } from "../modules/theme";

export default function LoginPages(pageProps: any) {
    const dispatch = useDispatch();

    return (
        <>
            <button onClick={() => {
                dispatch(toWhite())
            }}>
                test
            </button>
            <Login {...pageProps} />
        </>
    )
}