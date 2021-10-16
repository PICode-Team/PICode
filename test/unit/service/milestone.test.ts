import { assert } from "chai";
import { ResponseCode } from "../../../src/constants/response";
import DataMilestoneManager from "../../../src/module/data/issuespace/milestoneManager";
import { TMilestoneCreateData } from "../../../src/types/module/data/service/issuespace/milestone.types";

describe("Milestone Test", () => {
    it("create test", () => {
        const userId = "test@example.com";

        const milestoneCreateData = {
            title: "test milestone",
            content: "this is test milestone",
            startDate: "21-10-01",
            dueDate: "21-12-21",
        } as TMilestoneCreateData;
        const createResult = DataMilestoneManager.create(userId, milestoneCreateData);
        assert.equal(ResponseCode.ok.toString(), createResult.code.toString());
    });
});
