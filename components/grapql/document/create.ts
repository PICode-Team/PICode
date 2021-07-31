import { gql, useMutation } from "@apollo/client";

export default function QueryUpdate(path: string, creator: string) {
    let POSTQUERY = gql`
    mutation {
        createDocument(content:"[]", path: "${path}", creator:"${creator}")
    }`;

    const [addData] = useMutation(POSTQUERY);
}
