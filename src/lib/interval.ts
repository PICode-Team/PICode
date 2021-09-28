import DataChatManager from "../module/data/service/chatspace/chatManager";
//import DataDockerManager from "../module/data/service/workspace/dockerManager";

export default class IntervalManager {
    static run() {
        DataChatManager.run();
        //DataDockerManager.run();
    }
}
