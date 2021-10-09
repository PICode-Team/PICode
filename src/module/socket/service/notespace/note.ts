import { TSocketPacket } from "../../../../types/module/socket.types";
import DataNoteManager from "../../../data/service/notespace/noteManager";
import { TNoteData } from "../../../../types/module/data/service/notespace/note.types";
import { getSocket, makePacket } from "../etc/manager";
import log from "../../../log";

const docuemntFunc: Record<string, (userId: string, packet: any) => void> = {
    getNote,
    createNote,
    updateNote,
    deleteNote,
};

function getNote(userId: string, packet: any) {
    const sendData = makePacket("note", "getNote", DataNoteManager.get(packet.noteId));
    getSocket(userId).send(sendData);
}

function createNote(userId: string, packet: TNoteData) {
    const sendData = makePacket("note", "createNote", DataNoteManager.create(packet));
    getSocket(userId).send(sendData);
}

function updateNote(userId: string, packet: any) {
    const sendData = makePacket("note", "updateNote", DataNoteManager.update(packet.noteId, packet.note));
    getSocket(userId).send(sendData);
}

function deleteNote(userId: string, packet: any) {
    const sendData = makePacket("note", "deleteNote", DataNoteManager.delete(packet.noteId));
    getSocket(userId).send(sendData);
}

export default function Note(userId: string, packet: TSocketPacket) {
    docuemntFunc[packet.type](userId, packet.data);
}
