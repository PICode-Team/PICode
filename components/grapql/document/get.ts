import { gql, useQuery } from "@apollo/client";

export default function GetQuery() {
    const GETQUERY = gql`
        {
            getDocument {
                documentId
                content
                path
                creator
                createTime
            }
        }
    `;

    return GETQUERY;
}
