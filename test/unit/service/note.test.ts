import { assert } from "chai";
import { ResponseCode } from "../../../src/constants/response";
import DataNoteManager from "../../../src/module/data/notespace/noteManager";
import { TNoteData } from "../../../src/types/module/data/service/notespace/note.types";

describe("Note Test", () => {
    it("create test", () => {
        const noteId = "./test";
        const noteCreateData = {
            path: noteId,
            creator: "test@example.com",
        } as TNoteData;
        const createResult = DataNoteManager.create(noteCreateData);
        assert.equal(JSON.stringify({ code: ResponseCode.ok, noteId }), JSON.stringify(createResult));
    });
});
