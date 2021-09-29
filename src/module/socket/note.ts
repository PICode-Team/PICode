import { TSocketPacket } from "../../types/module/socket.types";
import DataNoteManager from "../data/service/notespace/noteManager";
import { GQLNote } from "../../types/module/data/service/notespace/note.types";
import { getSocket, makePacket } from "./manager";

const docuemntFunc: Record<string, (userId: string, packet: any) => void> = {
    getnote,
    createnote,
    updatenote,
    deletenote,
};

function getnote(userId: string, packet: any) {
    const sendData = makePacket("note", "getnote", DataNoteManager.get(packet.noteId));
    getSocket(userId).send(sendData);
}

function createnote(userId: string, packet: GQLNote) {
    const sendData = makePacket("note", "createnote", DataNoteManager.create(packet));
    getSocket(userId).send(sendData);
}

function updatenote(userId: string, packet: any) {
    const sendData = makePacket("note", "updatenote", DataNoteManager.update(packet.noteId, packet.note));
    getSocket(userId).send(sendData);
}

function deletenote(userId: string, packet: any) {
    const sendData = makePacket("note", "deletenote", DataNoteManager.delete(packet.noteId));
    getSocket(userId).send(sendData);
}

export default function note(userId: string, packet: TSocketPacket) {
    docuemntFunc[packet.type](userId, packet.data);
}
