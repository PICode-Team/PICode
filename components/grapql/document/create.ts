import { gql, useMutation } from "@apollo/client";
import { INoteContent } from "../../service/note/inlinebar";

export default function QueryCreate(
    path: string,
    creator: string,
    content: string
) {
    let POSTQUERY = gql`
    mutation {
        createDocument(content:"${content}", path: "${path}", creator:"${creator}")
    }`;

    return POSTQUERY;
}
