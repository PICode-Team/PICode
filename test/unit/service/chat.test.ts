import { assert } from "chai";
import DataChatManager from "../../../src/module/data/chatspace/chatManager";
import DataUserManager from "../../../src/module/data/user/userManager";
import { TUserData } from "../../../src/types/module/data/service/user/user.types";
import { getTestUser, createUser } from "../../testConstant";

describe("Chat Test", () => {
    const userId1 = "test1@example.com";
    const userId2 = "test2@example.com";

    const testUser1: TUserData = getTestUser(userId1);
    const testUSer2: TUserData = getTestUser(userId2);

    const chatDMName = userId2;
    const chatChannelName = "#testChannel";

    createUser(testUser1);
    createUser(testUSer2);

    const createDMData = {
        userId: userId1,
        chatName: chatDMName,
        description: "this is test chat(DM)",
        chatParticipant: [userId1, userId2],
    };

    const createChannelData = {
        userId: userId1,
        chatName: chatChannelName,
        description: "this is test chat(Channel)",
        chatParticipant: [userId1, userId2],
    };

    const testcaseCreate1 = DataChatManager.createChannel(createDMData);
    const testcaseCreate2 = DataChatManager.createChannel(createChannelData);

    const testcaseGet1 = DataChatManager.getChat(userId1, chatDMName);
    const testcaseGet2 = DataChatManager.getChat(userId1, chatChannelName);

    DataUserManager.delete(userId1);
    DataUserManager.delete(userId2);

    it("create test", () => {
        assert.equal(true, testcaseCreate1);
        assert.equal(true, testcaseCreate2);
    });
    it("get test", () => {
        assert.equal(chatDMName, testcaseGet1?.[0]?.chatName);
        assert.equal("this is test chat(DM)", testcaseGet1?.[0]?.description);
        assert.equal(JSON.stringify([userId1, userId2]), JSON.stringify(testcaseGet1?.[0]?.chatParticipant));

        assert.equal(chatChannelName, testcaseGet2?.[0]?.chatName);
        assert.equal("this is test chat(Channel)", testcaseGet2?.[0]?.description);
        assert.equal(JSON.stringify([userId1, userId2]), JSON.stringify(testcaseGet2?.[0]?.chatParticipant));
    });
});
