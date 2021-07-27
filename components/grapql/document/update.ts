import { gql, useMutation } from "@apollo/client";

interface INoteContent {
    text: string;
    content?: any; //table 이나 이미지 같은 거 넣을 때 사용할 듯
    type?: string;
    clicked?: boolean;
}

export default function QueryUpdate(
    documentId: string,
    content: INoteContent[]
) {
    let UPDATEQUERY = gql`
        mutation {
            updateDocument(
                documentId: "${documentId}"
                content: "${content}"
            )
        }
    `;

    const [updateData] = useMutation(UPDATEQUERY);
}
