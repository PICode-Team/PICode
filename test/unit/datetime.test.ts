import { assert } from "chai";
import { getTime } from "../../src/module/datetime";

describe("Datetime Test", () => {
    it("basic test", () => {
        const testTime = new Date();
        const defaultFormat = getTime(testTime);
        const customFormat = getTime(testTime, "YYYY-MM-DD");

        const year = testTime.getFullYear();
        const month = addZero(testTime.getMonth() + 1);
        const day = addZero(testTime.getDate());
        const hour = addZero(testTime.getHours());
        const minute = addZero(testTime.getMinutes());
        const second = addZero(testTime.getSeconds());

        assert.equal(defaultFormat, `${year}-${month}-${day} ${hour}:${minute}:${second}`);
        assert.equal(customFormat, `${year}-${month}-${day}`);
    });
});

function addZero(v: number) {
    return v < 10 ? `0${v}` : `${v}`;
}
