import { gql, useMutation } from "@apollo/client";

export default function QueryUpdate(documentId: string) {
    let POSTQUERY = gql`
        mutation {
            deleteDocument(documentId: "${documentId}")
        }
    `;

    const [addData] = useMutation(POSTQUERY);
}
