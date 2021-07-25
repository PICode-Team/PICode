import { gql } from "@apollo/client";

interface INoteContent {
    text: string;
    content?: any; //table 이나 이미지 같은 거 넣을 때 사용할 듯
    type?: string;
    clicked?: boolean;
}

export default function queryUpdate(
    documentId: string,
    content: INoteContent[]
) {
    let UPDATEQUERY = gql`
        mutation {
            updateDocument(
                documentId: "24194650-f825-4e36-86ad-c61d76d26c2d"
                content: "test333"
            )
        }
    `;
}
