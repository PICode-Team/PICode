import { assert } from "chai";
import DataUserManager from "../../../src/module/data/user/userManager";
import { TUserData } from "../../../src/types/module/data/service/user/user.types";
import { getTestUser } from "../../testConstant";

describe("User Test", () => {
    const userId1 = "test1@example.com";
    const userId2 = "test2@example.com";

    const testcase1: TUserData = getTestUser(userId1);
    const testcase2: TUserData = getTestUser(userId2);

    const createTest1 = createUser(testcase1);
    const createTest2 = createUser(testcase2);
    const getTest1 = DataUserManager.get(userId1);
    const getTest2 = DataUserManager.get(userId2);
    const deleteTest1 = DataUserManager.delete(userId1);
    const deleteTest2 = DataUserManager.delete(userId2);

    it("create test", () => {
        assert.equal(createTest1, true);
        assert.equal(createTest2, true);
    });

    it("get test", () => {
        assert.equal(testcase1.userId, getTest1.userId);
        assert.equal(testcase1.passwd, getTest1.passwd);
        assert.equal(testcase1.userName, getTest1.userName);

        assert.equal(testcase2.userId, getTest2.userId);
        assert.equal(testcase2.passwd, getTest2.passwd);
        assert.equal(testcase2.userName, getTest2.userName);
    });

    it("delete test", () => {
        assert.equal(deleteTest1, true);
        assert.equal(deleteTest2, true);
    });
});

export function createUser({ userId, userName, passwd }: TUserData) {
    return DataUserManager.create({ userId, userName, passwd, userThumbnail: undefined });
}
