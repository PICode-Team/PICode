import { assert } from "chai";
import { ResponseCode } from "../../../src/constants/response";
import DataIssueManager from "../../../src/module/data/service/issuespace/issueManager";
import DataKanbanManager from "../../../src/module/data/service/issuespace/kanbanManager";
import { TIssueData } from "../../../src/types/module/data/service/issuespace/issue.types";
import fs from "fs";

describe("Milestone Test", () => {
    it("create test", () => {
        const userId = "test@example.com";
        const kanbanUUID = fs.readdirSync(DataKanbanManager.getKanbanPath())?.[0];
        if (kanbanUUID !== "milestoneInfo.json") {
            const issueCreateData = {
                title: "test issue",
                creator: "test@example.com",
                assigner: "test@example.com",
                content: "this is test issue",
                startDate: "21-10-01",
                kanban: kanbanUUID,
                dueDate: "21-11-01",
            } as Omit<TIssueData, "issueId">;

            const createResult = DataIssueManager.create(userId, kanbanUUID, issueCreateData);
            assert.equal(ResponseCode.ok.toString(), createResult.code.toString());
        }
    });
});
