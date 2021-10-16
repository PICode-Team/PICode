import { assert } from "chai";
import { ResponseCode } from "../../../src/constants/response";
import DataCodeManager from "../../../src/module/data/service/codespace/codeManager";
import DataWorkspaceManager from "../../../src/module/data/service/workspace/workspaceManager";

describe("Code Test", () => {
    it("create file test", () => {
        const userId = "test@example.com";
        const workspaceName = "testWorkspace";
        const workspaceId = DataWorkspaceManager.getWorkspaceId(userId, workspaceName);
        const filePath = "./test.c";

        const createResult = DataCodeManager.createFile(userId, { workspaceId, filePath });
        assert.equal(JSON.stringify({ code: ResponseCode.ok, path: filePath }), JSON.stringify(createResult));
    });
});
