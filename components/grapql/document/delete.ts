import { gql, useMutation } from "@apollo/client";

export default function QueryDelete(documentId: string) {
    let POSTQUERY = gql`
        mutation {
            deleteDocument(documentId: "${documentId}")
        }
    `;

    return POSTQUERY;
}
