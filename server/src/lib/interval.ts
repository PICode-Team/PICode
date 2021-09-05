import DataChatManager from "../module/data/chatManager";
// import DataDockerManager from "../module/data/dockerManager";

export default class IntervalManager {
  static run() {
    DataChatManager.run();
    // DataDockerManager.run();
  }
}
