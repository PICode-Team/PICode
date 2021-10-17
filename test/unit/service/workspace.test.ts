import { assert } from "chai";
import { ResponseCode } from "../../../src/constants/response";
import DataUserManager from "../../../src/module/data/user/userManager";
import DataWorkspaceManager from "../../../src/module/data/workspace/workspaceManager";
import { TUserData } from "../../../src/types/module/data/service/user/user.types";
import { TDockerData } from "../../../src/types/module/data/service/workspace/docker.types";
import { TWorkspaceCreateData } from "../../../src/types/module/data/service/workspace/workspace.type";
import { getTestDockerInfo, getTestUser, getTestWorkspaceInfo } from "../../testConstant";
import { createUser } from "./user.test";

describe("Workspace Test", () => {
    const userId = "test@example.com";
    const workspaceName = "testWorkspace";
    const testUser: TUserData = getTestUser(userId);

    createUser(testUser);

    const workspaceInfo = getTestWorkspaceInfo(workspaceName, userId);
    const dockerInfo = getTestDockerInfo();

    const source: { type: "gitUrl" | "upload" | "nothing" } = {
        type: "nothing",
    };

    const createResult = DataWorkspaceManager.create(userId, workspaceInfo, dockerInfo, source);
    const workspaceId = createResult.workspaceId;
    const getResult = DataWorkspaceManager.get(userId, workspaceId);

    const deleteResult = DataWorkspaceManager.delete(userId, workspaceId);

    DataUserManager.delete(userId);

    it("create test", () => {
        assert.equal(ResponseCode.ok.toString(), createResult.code.toString());
    });

    it("get test", () => {
        assert.equal(workspaceName, getResult?.[0]?.name);
        assert.equal(userId, getResult?.[0]?.creator);
        assert.equal(workspaceInfo.description, getResult?.[0]?.description);
    });
});

function createWorkspace(
    userId: string,
    workspaceInfo: TWorkspaceCreateData,
    dockerInfo: TDockerData,
    source: {
        type: "gitUrl" | "upload" | "nothing";
        gitUrl?: string;
        upload?: {
            uploadFileId: string;
            isExtract?: boolean;
        };
    }
) {
    return DataWorkspaceManager.create(userId, workspaceInfo, dockerInfo, source);
}
