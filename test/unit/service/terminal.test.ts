import { assert } from "chai";
import { v4 as uuidv4 } from "uuid";
import DataTerminalManager from "../../../src/module/data/codespace/terminalManager";

describe("Terminal Test", () => {
    it("create test", () => {
        const userId = "test@example.com";
        const uuid = uuidv4();
        const createResult = DataTerminalManager.createTerminal(userId, uuid);
        assert.equal("Worker", typeof createResult);
    });
});
