import { assert } from "chai";
import { ResponseCode } from "../../../src/constants/response";
import DataWorkspaceManager from "../../../src/module/data/service/workspace/workspaceManager";

describe("Workspace Test", () => {
    it("create test", () => {
        const userId = "test@example.com";
        const workspaceInfo = {
            name: "testWorkspace",
            description: "this is test workspace",
            participants: [userId],
        };
        const dockerInfo = {
            containerName: "testContainer",
            image: "ubuntu",
            tag: "18.04",
            portInfo: { "1111": 1111, "1234": 1234 },
        };
        const source: { type: "gitUrl" | "upload" | "nothing" } = {
            type: "nothing",
        };
        const result = DataWorkspaceManager.create(userId, workspaceInfo, dockerInfo, source);
        assert(JSON.stringify({ code: ResponseCode.ok }), JSON.stringify(result));
    });
});

function addZero(v: number) {
    return v < 10 ? `0${v}` : `${v}`;
}
