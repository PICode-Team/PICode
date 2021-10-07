import { TSocketPacket } from "../../types/module/socket.types";
import DataNoteManager from "../data/service/notespace/noteManager";
import { GQLNote } from "../../types/module/data/service/notespace/note.types";
import { getSocket, makePacket } from "./manager";

const docuemntFunc: Record<string, (userId: string, packet: any) => void> = {
    getNote,
    createNote,
    updateNote,
    deleteNote,
};

function getNote(userId: string, packet: any) {
    const sendData = makePacket("note", "getNote", DataNoteManager.get(packet.NoteId));
    getSocket(userId).send(sendData);
}

function createNote(userId: string, packet: GQLNote) {
    const sendData = makePacket("note", "createNote", DataNoteManager.create(packet));
    getSocket(userId).send(sendData);
}

function updateNote(userId: string, packet: any) {
    const sendData = makePacket("note", "updateNote", DataNoteManager.update(packet.NoteId, packet.Note));
    getSocket(userId).send(sendData);
}

function deleteNote(userId: string, packet: any) {
    const sendData = makePacket("note", "deleteNote", DataNoteManager.delete(packet.NoteId));
    getSocket(userId).send(sendData);
}

export default function Note(userId: string, packet: TSocketPacket) {
    docuemntFunc[packet.type](userId, packet.data);
}
