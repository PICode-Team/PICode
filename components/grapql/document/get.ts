import { gql, useQuery } from "@apollo/client";

export default function GetQuery(documentId: string) {
    const GETQUERY = gql`
        {
            getDocument {
                documentId
            }
        }
    `;

    const { data, loading, error } = useQuery(GETQUERY);

    return data;
}
