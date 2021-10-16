import { assert } from "chai";
import DataChatManager from "../../../src/module/data/chatspace/chatManager";

describe("Chat Test", () => {
    it("create test", () => {
        const createDMData = {
            userId: "test@example.com",
            chatName: "@test@example.com{sep}test2@example.com",
            description: "this is test chat(DM)",
            chatParticipant: ["test@example.com", "test2@example.com"],
        };

        const resultDM = DataChatManager.createChannel(createDMData);
        assert.equal(true, resultDM);

        const createChannelData = {
            userId: "test@example.com",
            chatName: "#testChannel",
            description: "this is test chat(Channel)",
            chatParticipant: ["test@example.com", "test2@example.com"],
        };

        const resultChannel = DataChatManager.createChannel(createChannelData);
        assert.equal(true, resultChannel);
    });
});
