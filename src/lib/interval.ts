import DataChatManager from "../module/data/service/chatspace/chatManager";
import DataCodeManager from "../module/data/service/codespace/codeManager";
import DataNoteManager from "../module/data/service/notespace/noteManager";
import DataDockerManager from "../module/data/service/workspace/dockerManager";

export default class IntervalManager {
    static run() {
        DataChatManager.run();
        DataCodeManager.run();
        DataNoteManager.run();
        DataDockerManager.run();
    }
}
