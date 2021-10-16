import { assert } from "chai";
import { v4 as uuidv4 } from "uuid";
import { ResponseCode } from "../../../src/constants/response";
import DataTerminalManager from "../../../src/module/data/service/codespace/terminalManager";
import DataWorkspaceManager from "../../../src/module/data/service/workspace/workspaceManager";

describe("Terminal Test", () => {
    it("create test", () => {
        const userId = "test@example.com";
        const uuid = uuidv4();
        const createResult = DataTerminalManager.createTerminal(userId, uuid);
        assert.equal("Worker", typeof createResult);
    });
});
