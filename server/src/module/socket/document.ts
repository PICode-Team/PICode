import { TSocketPacket } from "../../types/module/socket.types";
import DataDocumentManager from "../data/documentManager";
import { GQLDocument } from "../graphql/object/document";
import { getSocket, makePacket } from "./manager";

const docuemntFunc: { [key in string]: (userId: string, packet: any) => void } =
    {
        getDocument,
        createDocument,
        updateDocument,
        deelteDocument,
    };

function getDocument(userId: string, packet: any) {
    const sendData = JSON.stringify(
        makePacket(
            "document",
            "getDocument",
            DataDocumentManager.get(packet.documentId)
        )
    );
    getSocket(userId).send(sendData);
}

function createDocument(userId: string, packet: GQLDocument) {
    const sendData = JSON.stringify(
        makePacket(
            "document",
            "createDocument",
            DataDocumentManager.create(packet)
        )
    );
    getSocket(userId).send(sendData);
}

function updateDocument(userId: string, packet: any) {
    const sendData = JSON.stringify(
        makePacket(
            "document",
            "updateDocument",
            DataDocumentManager.update(packet.documentId, packet.document)
        )
    );
    getSocket(userId).send(sendData);
}

function deelteDocument(userId: string, packet: any) {
    const sendData = JSON.stringify(
        makePacket(
            "document",
            "deleteDocument",
            DataDocumentManager.delete(packet.documentId)
        )
    );
    getSocket(userId).send(sendData);
}

export default function document(userId: string, packet: TSocketPacket) {
    docuemntFunc[packet.type](userId, packet.data);
}
