import DataChatManager from "../module/data/chatspace/chatManager";
import DataCodeManager from "../module/data/codespace/codeManager";
import DataNoteManager from "../module/data/notespace/noteManager";
import DataDockerManager from "../module/data/workspace/dockerManager";

export default class IntervalManager {
    static run() {
        DataChatManager.run();
        DataCodeManager.run();
        DataNoteManager.run();
        DataDockerManager.run();
    }
}
