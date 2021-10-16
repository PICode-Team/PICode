import { assert } from "chai";
import { ResponseCode } from "../../../src/constants/response";
import DataKanbanManager from "../../../src/module/data/service/issuespace/kanbanManager";
import DataWorkspaceManager from "../../../src/module/data/service/workspace/workspaceManager";
import { TkanbanCreateData } from "../../../src/types/module/data/service/issuespace/kanban.types";

describe("Kanban Test", () => {
    it("create test", () => {
        const userId = "test@example.com";
        const workspaceName = "testWorkspace";
        const workspaceId = DataWorkspaceManager.getWorkspaceId(userId, workspaceName);
        const kanbanCreateData = {
            title: "test milestone",
            workspaceId,
        } as TkanbanCreateData;
        const createResult = DataKanbanManager.create(userId, kanbanCreateData);
        assert.equal(ResponseCode.ok.toString(), createResult.code.toString());
    });
});
