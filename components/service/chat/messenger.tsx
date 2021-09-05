import React, { useEffect, useRef, useState } from "react";
import { messengerStyle } from "../../../styles/service/chat/messenger";
import {
  ChatBubbleOutline,
  NavigateBefore,
  Close,
  FiberManualRecord,
  Send,
  SentimentSatisfied,
  AttachFile,
  FilterNone,
  SmsOutlined,
  FavoriteBorderOutlined,
} from "@material-ui/icons";
import moment from "moment";
import {
  chatStyle,
  createChannelStyle,
} from "../../../styles/service/chat/chat";
import Add from "@material-ui/icons/Add";

interface TRoom {
  room: string;
}

type TUser = {
  [key in string]: boolean;
};

interface IUser {
  userId: string;
  userName: string;
  userThumbnail?: string;
}

function CreateChannel({
  modal,
  userId,
  setModal,
  createChannel,
}: {
  modal: boolean;
  userId: string;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  createChannel: (
    chatName: string,
    description?: string,
    participant?: string[]
  ) => void;
}) {
  const classes = createChannelStyle();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [users, setUsers] = useState<TUser>({});
  const [userList, setUserList] = useState<IUser[]>([]);
  const [isDirect, setIsDirect] = useState<boolean>(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getParticipantList();
  }, []);

  useEffect(() => {
    const temp = userList.reduce((a: TUser, c: IUser) => {
      if (c.userName === userId) return a;
      return { ...a, [c.userName]: false };
    }, {});

    setUsers(temp);
  }, [userList]);

  const getParticipantList = async () => {
    await fetch(`http://localhost:8000/api/userList`, {
      method: "GET",
      mode: "cors",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 200) {
          setUserList(res.user);
        }
      });
  };

  return (
    <React.Fragment>
      <div
        className={`${classes.overlay} ${!modal && classes.visibility}`}
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          event.preventDefault();

          setModal(false);
        }}
      ></div>
      <div className={`${classes.modal} ${!modal && classes.visibility}`}>
        <div className={classes.modalHeader}>
          <span>Create Channel</span>
          <div
            onClick={(event: React.MouseEvent<HTMLElement>) => {
              setModal(false);
            }}
          >
            <Close />
          </div>
        </div>
        <div className={classes.modalBody}>
          <input
            type="text"
            placeholder={isDirect === false ? "Channel Name" : "User Name"}
            ref={nameRef}
            value={name}
            className={classes.input}
            onChange={(event: any) => {
              setName(event.currentTarget.value);
            }}
          />
          <input
            type="text"
            placeholder="Description"
            ref={descriptionRef}
            value={description}
            className={classes.input}
            onChange={(event: any) => {
              setDescription(event.currentTarget.value);
            }}
          />
          <div
            style={{
              color: "#ffffff",
              fontSize: "12px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            is Direct Message?
            <input
              type="checkbox"
              checked={isDirect}
              onClick={(e) => {
                setIsDirect(!isDirect);
              }}
              style={{ verticalAlign: "middle" }}
            />
          </div>
          <div className={classes.participantWrapper}>
            {!isDirect &&
              Object.keys(users).map((v, i) => (
                <div className={classes.participant} key={`checkbox-${i}`}>
                  <input
                    type="checkbox"
                    name={v}
                    id={v}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setUsers({
                        ...users,
                        [event.target.name]: event.target.checked,
                      });
                    }}
                  />
                  <label htmlFor={v}>{v}</label>
                </div>
              ))}
          </div>
        </div>
        <div className={classes.modalFooter}>
          <button
            onClick={() => {
              const participant = Object.keys(users).filter((v) => users[v]);

              createChannel(
                `${!isDirect ? "#" : ""}${name}`,
                description,
                isDirect ? [name] : participant
              );
              setName("");
              setDescription("");
              setIsDirect(false);
              setModal(false);
            }}
          >
            Create
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}

interface IChannel {
  chatName?: string;
  userId?: string;
  chatParticipant: string[];
  creation: string;
  description: string;
}

function Home({
  setOpen,
  setTarget,
  targetList,
  classes,
  setModal,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTarget: React.Dispatch<React.SetStateAction<string>>;
  targetList: IChannel[];
  classes: any;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className={classes.messenger}>
      <div className={classes.wrapper}>
        <div className={classes.homeHeader}>
          <div className={classes.opponent}>
            <div className={classes.name}>
              <span
                style={{
                  marginRight: "4px",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                Chatting
              </span>
            </div>
            <div className={classes.online}></div>
          </div>
          <div
            className={classes.expand}
            onClick={() => {
              window.location.href = "/chat";
            }}
          >
            <FilterNone />
          </div>
          <div
            className={classes.cancel}
            onClick={() => {
              setOpen(false);
            }}
          >
            <Close />
          </div>
        </div>
        <div className={classes.homeBody}>
          {targetList.map((v, i) => (
            <Row
              key={`messenger-row-${i}`}
              target={v.chatName ?? ""}
              setTarget={setTarget}
              classes={classes}
            />
          ))}
          <div
            className={classes.row}
            onClick={() => {
              setModal(true);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Add style={{ color: "#ffffff", width: "30px", height: "30px" }} />
          </div>
        </div>
        <div className={classes.homeFooter}></div>
      </div>
    </div>
  );
}

function DayBoundary({ text }: { text: string }) {
  const classes = messengerStyle();

  return (
    <div className={classes.timeWrapper}>
      <div className={classes.dayBoundary}></div>
      <div className={classes.timeTicket}>{text}</div>
    </div>
  );
}

interface TMessage {
  sender: string;
  text: string;
  time: string;
}

interface IThread {
  parentUser: string;
  parentMessage: string;
  chatName: string;
  messages: IChat[];
  parentId: string;
  parentTime: string;
}

function Room({
  setOpen,
  sendMessage,
  target,
  messages,
  newMessage,
  classes,
  setTarget,
  userId,
  thread,
  setThread,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sendMessage: (target: string, msg: string) => void;
  target: string;
  messages: IChat[];
  newMessage: boolean;
  classes: any;
  setTarget: React.Dispatch<React.SetStateAction<string>>;
  userId: string;
  thread: IThread | undefined;
  setThread: React.Dispatch<React.SetStateAction<IThread | undefined>>;
}) {
  const [messageList, setMessageList] = useState<TMessage[]>([]);
  const messageRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  function enterEvent(event: KeyboardEvent) {
    if (event.key === "Enter") {
      if (
        messageRef.current &&
        target !== "" &&
        messageRef.current.value !== ""
      ) {
        sendMessage(target, messageRef.current.value);
        messageRef.current.value = "";
        endRef.current!.scrollIntoView();
      }
    }
  }

  function KMessageBox({ user, message, time, chatId, threadList }: IChat) {
    const classes = messengerStyle();
    const timeValue = time.split(" ")[1].split(":");
    const meridiem = Number(timeValue[0]) > 11 ? "PM" : "AM";
    const hour = (() => {
      const convertedHour = Number(timeValue[0]);

      if (convertedHour % 12 === 0) {
        return "12";
      }

      if (convertedHour < 12) {
        return timeValue[0];
      } else {
        if (convertedHour % 12 < 10) {
          return `0${convertedHour % 12}`;
        }

        return `${convertedHour % 12}`;
      }
    })();
    const timeText = `${meridiem} ${hour}:${timeValue[1]} `;

    return (
      <div className={classes.messageBox}>
        <div className={classes.user}></div>
        <div className={classes.messageInfo}>
          <div className={classes.target}>{user}</div>
          <div className={classes.textWrapper}>
            <span className={classes.messageText}>{message}</span>
            <span className={classes.time}>
              <span>{timeText}</span>
              <div className={classes.messageInteraction}>
                <div
                  className={classes.interactionIcon}
                  onClick={() => {
                    setThread({
                      chatName: target,
                      messages: threadList,
                      parentId: chatId,
                      parentMessage: message,
                      parentTime: time,
                      parentUser: user,
                    });
                  }}
                >
                  <SmsOutlined />
                </div>
                <div className={classes.interactionDivider} />
                <div className={classes.interactionIcon}>
                  <FavoriteBorderOutlined />
                </div>
              </div>
            </span>
          </div>
          {threadList.length > 0 && (
            <Thread
              parentUser={user}
              parentMessage={message}
              parentId={chatId}
              particiapnts={[]}
              messages={threadList}
              lastTime={threadList.slice(-1)[0].time}
              parentTime={time}
            />
          )}
        </div>
      </div>
    );
  }

  function KMessageReverseBox({
    user,
    message,
    time,
    chatId,
    threadList,
  }: IChat) {
    const classes = messengerStyle();
    const timeValue = time.split(" ")[1].split(":");
    const meridiem = Number(timeValue[0]) > 11 ? "PM" : "AM";
    const hour = (() => {
      const convertedHour = Number(timeValue[0]);

      if (convertedHour % 12 === 0) {
        return "12";
      }

      if (convertedHour < 12) {
        return timeValue[0];
      } else {
        if (convertedHour % 12 < 10) {
          return `0${convertedHour % 12}`;
        }

        return `${convertedHour % 12}`;
      }
    })();
    const timeText = `${meridiem} ${hour}:${timeValue[1]} `;

    return (
      <div
        className={classes.messageBox}
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <div className={classes.messageInfo}>
          <div
            className={classes.textWrapper}
            style={{ display: "flex", flexDirection: "row-reverse" }}
          >
            <div className={classes.messageText}>{message}</div>
            <span className={classes.time}>
              <span>{timeText}</span>
              <div className={classes.messageInteraction}>
                <div
                  className={classes.interactionIcon}
                  onClick={() => {
                    setThread({
                      chatName: target,
                      messages: threadList,
                      parentId: chatId,
                      parentMessage: message,
                      parentTime: time,
                      parentUser: user,
                    });
                  }}
                >
                  <SmsOutlined />
                </div>
                <div className={classes.interactionDivider} />
                <div className={classes.interactionIcon}>
                  <FavoriteBorderOutlined />
                </div>
              </div>
            </span>
          </div>
          {threadList.length > 0 && (
            <Thread
              parentUser={user}
              parentMessage={message}
              parentId={chatId}
              particiapnts={[]}
              messages={threadList}
              lastTime={threadList.slice(-1)[0].time}
              parentTime={time}
            />
          )}
        </div>
      </div>
    );
  }

  function Thread({
    parentId,
    particiapnts,
    messages,
    lastTime,
    parentUser,
    parentMessage,
    parentTime,
  }: {
    parentId: string;
    particiapnts: string[];
    messages: IChat[];
    lastTime: string;
    parentUser: string;
    parentMessage: string;
    parentTime: string;
  }) {
    const classes = chatStyle();

    return (
      <div
        className={classes.thread}
        onClick={() => {
          setThread({
            parentUser: parentUser,
            parentMessage: parentMessage,
            parentTime: parentTime,
            chatName: target,
            parentId: parentId,
            messages: messages,
          });
        }}
      >
        <div className={classes.threadParticipant}>
          {particiapnts.map((v, i) => {
            <div key={`${parentId}-thread-${i}`}></div>;
          })}
        </div>
        <div className={classes.threadCount}>{messages.length} replies</div>
        <div className={classes.lastThread}>Last reply 2 hours ago</div>
      </div>
    );
  }

  function renderMessage(messages: IChat[], classes: any, userId: string) {
    const value = [];

    for (let i = 0; i < messages.length; i++) {
      const dayCheck =
        i === 0 ||
        messages[i - 1].time.split(" ")[0] !== messages[i].time.split(" ")[0];
      if (messages[i].user === userId) {
        value.push(
          <React.Fragment>
            {dayCheck && <DayBoundary text={messages[i].time.split(" ")[0]} />}
            <KMessageReverseBox {...messages[i]} key={`messagebox-${i}`} />
          </React.Fragment>
        );
      } else {
        value.push(
          <React.Fragment>
            {dayCheck && <DayBoundary text={messages[i].time.split(" ")[0]} />}
            <KMessageBox {...messages[i]} key={`messagebox-${i}`} />
          </React.Fragment>
        );
      }
    }

    return (
      <React.Fragment>
        {value.map((v, i) => (
          <React.Fragment key={`message-wrapper-${i}`}>{v}</React.Fragment>
        ))}
      </React.Fragment>
    );
  }

  useEffect(() => {
    document.addEventListener("keypress", enterEvent);
    return () => {
      document.removeEventListener("keypress", enterEvent);
    };
  }, [target]);

  useEffect(() => {
    setMessageList([]);
  }, []);

  return (
    <div className={classes.messenger}>
      <div className={classes.wrapper}>
        <div className={classes.header}>
          <div
            className={classes.back}
            onClick={() => {
              setTarget("");
            }}
          >
            <NavigateBefore />
          </div>
          <div className={classes.opponent}>
            <div className={classes.name}>{target}</div>
            <div className={classes.online}></div>
          </div>
          <div
            className={classes.expand}
            onClick={() => {
              window.location.href = "/chat";
            }}
          >
            <FilterNone />
          </div>
          <div
            className={classes.cancel}
            onClick={() => {
              setOpen(false);
            }}
          >
            <Close />
          </div>
        </div>
        <div className={classes.body}>
          <div className={classes.content}>
            {renderMessage(messages, classes, userId)}
            <div ref={endRef}></div>
          </div>
        </div>
        <div className={classes.footer}>
          <div className={classes.attachFile}>
            <AttachFile />
          </div>
          <div className={classes.imoji}>
            <SentimentSatisfied />
          </div>
          <input
            className={classes.input}
            type="text"
            placeholder="메시지를 입력해주세요"
            ref={messageRef}
          />
          <div
            className={classes.send}
            onClick={() => {
              if (
                messageRef.current &&
                target !== "" &&
                messageRef.current.value !== ""
              ) {
                sendMessage(target, messageRef.current.value);
                messageRef.current.value = "";
                endRef.current!.scrollIntoView();
              }
            }}
          >
            <Send />
          </div>
        </div>
      </div>
    </div>
  );
}

function ThreadMessage({
  setOpen,
  sendMessage,
  target,
  messages,
  newMessage,
  classes,
  setTarget,
  userId,
  thread,
  setThread,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sendMessage: (target: string, msg: string) => void;
  target: string;
  messages: IChat[];
  newMessage: boolean;
  classes: any;
  setTarget: React.Dispatch<React.SetStateAction<string>>;
  userId: string;
  thread: IThread;
  setThread: React.Dispatch<React.SetStateAction<IThread | undefined>>;
}) {
  const [messageList, setMessageList] = useState<TMessage[]>([]);
  const messageRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  function KMessageBox({ user, message, time, chatId, threadList }: IChat) {
    const classes = messengerStyle();
    const timeValue = time.split(" ")[1].split(":");
    const meridiem = Number(timeValue[0]) > 11 ? "PM" : "AM";
    const hour = (() => {
      const convertedHour = Number(timeValue[0]);

      if (convertedHour % 12 === 0) {
        return "12";
      }

      if (convertedHour < 12) {
        return timeValue[0];
      } else {
        if (convertedHour % 12 < 10) {
          return `0${convertedHour % 12}`;
        }

        return `${convertedHour % 12}`;
      }
    })();
    const timeText = `${meridiem} ${hour}:${timeValue[1]} `;

    return (
      <div className={classes.messageBox}>
        <div className={classes.user}></div>
        <div className={classes.messageInfo}>
          <div className={classes.target}>{user}</div>
          <div className={classes.textWrapper}>
            <span className={classes.messageText}>{message}</span>
            <span className={classes.time}>
              <span>{timeText}</span>
              <div className={classes.messageInteraction}>
                <div
                  className={classes.interactionIcon}
                  onClick={() => {
                    setThread({
                      chatName: target,
                      messages: threadList,
                      parentId: chatId,
                      parentMessage: message,
                      parentTime: time,
                      parentUser: user,
                    });
                  }}
                >
                  <SmsOutlined />
                </div>
                <div className={classes.interactionDivider} />
                <div className={classes.interactionIcon}>
                  <FavoriteBorderOutlined />
                </div>
              </div>
            </span>
          </div>
          {threadList.length > 0 && (
            <Thread
              parentUser={user}
              parentMessage={message}
              parentId={chatId}
              particiapnts={[]}
              messages={threadList}
              lastTime={threadList.slice(-1)[0].time}
              parentTime={time}
            />
          )}
        </div>
      </div>
    );
  }

  function KMessageReverseBox({
    user,
    message,
    time,
    chatId,
    threadList,
  }: IChat) {
    const classes = messengerStyle();
    const timeValue = time.split(" ")[1].split(":");
    const meridiem = Number(timeValue[0]) > 11 ? "PM" : "AM";
    const hour = (() => {
      const convertedHour = Number(timeValue[0]);

      if (convertedHour % 12 === 0) {
        return "12";
      }

      if (convertedHour < 12) {
        return timeValue[0];
      } else {
        if (convertedHour % 12 < 10) {
          return `0${convertedHour % 12}`;
        }

        return `${convertedHour % 12}`;
      }
    })();
    const timeText = `${meridiem} ${hour}:${timeValue[1]} `;

    return (
      <div
        className={classes.messageBox}
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <div className={classes.messageInfo}>
          <div
            className={classes.textWrapper}
            style={{ display: "flex", flexDirection: "row-reverse" }}
          >
            <div className={classes.messageText}>{message}</div>
            <span className={classes.time}>
              <span>{timeText}</span>
              <div className={classes.messageInteraction}>
                <div
                  className={classes.interactionIcon}
                  onClick={() => {
                    setThread({
                      chatName: target,
                      messages: threadList,
                      parentId: chatId,
                      parentMessage: message,
                      parentTime: time,
                      parentUser: user,
                    });
                  }}
                >
                  <SmsOutlined />
                </div>
                <div className={classes.interactionDivider} />
                <div className={classes.interactionIcon}>
                  <FavoriteBorderOutlined />
                </div>
              </div>
            </span>
          </div>
          {threadList.length > 0 && (
            <Thread
              parentUser={user}
              parentMessage={message}
              parentId={chatId}
              particiapnts={[]}
              messages={threadList}
              lastTime={threadList.slice(-1)[0].time}
              parentTime={time}
            />
          )}
        </div>
      </div>
    );
  }

  function Thread({
    parentId,
    particiapnts,
    messages,
    lastTime,
    parentUser,
    parentMessage,
    parentTime,
  }: {
    parentId: string;
    particiapnts: string[];
    messages: IChat[];
    lastTime: string;
    parentUser: string;
    parentMessage: string;
    parentTime: string;
  }) {
    const classes = chatStyle();

    return (
      <div
        className={classes.thread}
        onClick={() => {
          setThread({
            parentUser: parentUser,
            parentMessage: parentMessage,
            parentTime: parentTime,
            chatName: target,
            parentId: parentId,
            messages: messages,
          });
        }}
      >
        <div className={classes.threadParticipant}>
          {particiapnts.map((v, i) => {
            <div key={`${parentId}-thread-${i}`}></div>;
          })}
        </div>
        <div className={classes.threadCount}>{messages.length} replies</div>
        <div className={classes.lastThread}>Last reply 2 hours ago</div>
      </div>
    );
  }

  function renderMessage(messages: IChat[], classes: any, userId: string) {
    const value = [];

    for (let i = 0; i < messages.length; i++) {
      if (messages[i].user === userId) {
        value.push(
          <React.Fragment>
            <KMessageReverseBox {...messages[i]} key={`messagebox-${i}`} />
          </React.Fragment>
        );
      } else {
        value.push(
          <React.Fragment>
            <KMessageBox {...messages[i]} key={`messagebox-${i}`} />
          </React.Fragment>
        );
      }
    }

    return (
      <React.Fragment>
        {value.map((v, i) => (
          <React.Fragment key={`message-wrapper-${i}`}>{v}</React.Fragment>
        ))}
      </React.Fragment>
    );
  }

  return (
    <div className={classes.messenger} style={{ boxShadow: "none" }}>
      <div className={classes.wrapper}>
        <div className={classes.header}>
          <div
            className={classes.back}
            onClick={() => {
              setThread(undefined);
            }}
          >
            <NavigateBefore />
          </div>
          <div className={classes.opponent}>
            <div className={classes.name}>
              <span
                style={{
                  marginRight: "4px",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                Thread
              </span>
              {target}
            </div>
            <div className={classes.online}></div>
          </div>
          <div
            className={classes.expand}
            onClick={() => {
              window.location.href = "/chat";
            }}
          >
            <FilterNone />
          </div>
          <div
            className={classes.cancel}
            onClick={() => {
              setOpen(false);
            }}
          >
            <Close />
          </div>
        </div>
        <div className={classes.body}>
          <div className={classes.content}>
            <KMessageBox
              user={thread.parentUser}
              message={thread.parentMessage}
              time={thread.parentTime}
              threadList={[]}
              chatId=""
            />
            {thread.messages.length > 0 && (
              <DayBoundary text={`${thread.messages.length} replies`} />
            )}
            {renderMessage(messages, classes, userId)}
            <div ref={endRef}></div>
          </div>
        </div>
        <div className={classes.footer}>
          <div className={classes.attachFile}>
            <AttachFile />
          </div>
          <div className={classes.imoji}>
            <SentimentSatisfied />
          </div>
          <input
            className={classes.input}
            type="text"
            placeholder="메시지를 입력해주세요"
            ref={messageRef}
          />
          <div
            className={classes.send}
            onClick={() => {
              if (
                messageRef.current &&
                target !== "" &&
                messageRef.current.value !== ""
              ) {
                sendMessage(target, messageRef.current.value);
                messageRef.current.value = "";
                endRef.current!.scrollIntoView();
              }
            }}
          >
            <Send />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  target,
  setTarget,
  classes,
}: {
  target: string;
  setTarget: React.Dispatch<React.SetStateAction<string>>;
  classes: any;
}) {
  if (target === undefined) return <React.Fragment></React.Fragment>;

  return (
    <div
      className={classes.row}
      onClick={() => {
        setTarget(target);
      }}
    >
      <div className={classes.users}></div>
      <div className={classes.titleWrapper}>
        <div className={classes.title}>
          <div className={classes.titleText}>{target}</div>
          <div className={classes.participant}>
            {target.slice(0, 1) === "#" && 4}
          </div>
          <div className={classes.etc}></div>
        </div>
        <div className={classes.thumbnail}>
          gna. Sed consequat, leo eget bibendum sodales, augue velit cu
        </div>
      </div>
      <div className={classes.chatInfo}>
        <div className={classes.lastTime}>AM 12:32</div>
        {/*<div className={classes.count}>231</div>*/}
      </div>
    </div>
  );
}

interface IChat {
  user: string;
  time: string;
  message: string;
  chatId: string;
  threadList: IChat[];
}

function getTime(
  time: Date | string | undefined = undefined,
  format: string = "YYYY-MM-DD HH:mm:ss"
) {
  return moment(time).format(format);
}

export default function Messenger({ ws, userId }: { ws: any; userId: string }) {
  const classes = messengerStyle();
  const [open, setOpen] = useState<boolean>(false);
  const [room, setRoom] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  const [targetList, setTargetList] = useState<IChannel[]>([]);
  const [messages, setMessages] = useState<IChat[]>([]);
  const [newMessage, setNewMessage] = useState<boolean>(false);
  const [thread, setThread] = useState<IThread | undefined>(undefined);
  const [modal, setModal] = useState<boolean>(false);

  if (
    typeof window !== "undefined" &&
    window.location.href.indexOf("chat") !== -1
  )
    return <React.Fragment />;

  function sendMessage(target: string, msg: string) {
    if (ws.current) {
      ws.current.send(
        JSON.stringify({
          category: "chat",
          type: "sendMessage",
          data: {
            target: target,
            msg: msg,
          },
        })
      );
    }
  }

  function getChat() {
    if (ws.current) {
      ws.current.send(
        JSON.stringify({
          category: "chat",
          type: "getChat",
        })
      );
    }
  }

  function getChatLog(target: string, page: string) {
    if (ws.current) {
      ws.current.send(
        JSON.stringify({
          category: "chat",
          type: "getChatLog",
          data: {
            target: target,
            page: page,
          },
        })
      );
    }
  }

  function getChatLogList(target: string) {
    if (ws.current) {
      ws.current.send(
        JSON.stringify({
          category: "chat",
          type: "getChatLogList",
          data: {
            target: target,
          },
        })
      );
    }
  }

  function createChannel(
    chatName: string,
    description?: string,
    participant?: string[]
  ) {
    if (ws.current) {
      ws.current.send(
        JSON.stringify({
          category: "chat",
          type: "createChannel",
          data: {
            target: chatName,
            description: description,
            chatParticipant: [userId, ...(participant ?? [])],
          },
        })
      );
    }
  }

  useEffect(() => {
    if (ws === null) return;

    if (ws.current) {
      if (targetList.length === 0) getChat();

      ws.current.onmessage = (msg: any) => {
        const message = JSON.parse(msg.data);

        if (message.category === "chat") {
          switch (message.type) {
            case "createChannel":
              getChat();
              break;
            case "getChat":
              const channelList: IChannel[] = [];

              message.data.forEach((v: any) => {
                channelList.push(v);
              });

              setTargetList(channelList);
              break;

            case "getChatLog":
              const messageList: IChat[] = [];
              message.data.forEach((v: any) => {
                messageList.push({
                  user: v.sender,
                  message: v.message,
                  time: v.time,
                  chatId: v.chatId ?? "",
                  threadList: v.threadList ?? [],
                });
              });
              setMessages([...messages, ...messageList]);
              break;
            case "getChatLogList":
              message.data.forEach((v: string) => {
                getChatLog(target, v);
              });
              break;
            case "sendMessage":
              if (message.data.parentChatId !== undefined) {
                const messageList: IChat[] = messages.map((v) => {
                  if (v.chatId === message.data.parentChatId) {
                    return {
                      ...v,
                      threadList: [
                        ...v.threadList,
                        {
                          user: message.data.sender,
                          message: message.data.message,
                          time: message.data.time ?? "2021-08-26 11:32:14",
                          chatId: message.data.chatId ?? "",
                          threadList: message.data.threadList ?? [],
                        },
                      ],
                    };
                  }

                  return v;
                });

                setMessages(messageList);
              } else {
                if (message.data.sender !== userId) {
                  setNewMessage(true);
                  setTimeout(() => {
                    setNewMessage(false);
                  }, 3000);
                }

                setMessages([
                  ...messages,
                  {
                    user: message.data.sender,
                    message: message.data.message,
                    time: message.data.time ?? "2021-08-26 11:32:14",
                    chatId: message.data.chatId ?? "",
                    threadList: message.data.threadList ?? [],
                  },
                ]);
              }

              break;
          }
        }
      };
    }
  }, [ws.current, messages]);

  useEffect(() => {
    setMessages([]);

    if (target !== "") {
      getChatLogList(target);
    }
  }, [target]);

  if (open) {
    return (
      <React.Fragment>
        {target === "" ? (
          <Home
            setOpen={setOpen}
            targetList={targetList}
            setTarget={setTarget}
            classes={classes}
            setModal={setModal}
          ></Home>
        ) : (
          <Room
            setOpen={setOpen}
            userId={userId}
            sendMessage={sendMessage}
            target={target}
            messages={messages}
            newMessage={newMessage}
            classes={classes}
            setTarget={setTarget}
            thread={thread}
            setThread={setThread}
          ></Room>
        )}
        {thread !== undefined && (
          <ThreadMessage
            setOpen={setOpen}
            userId={userId}
            sendMessage={sendMessage}
            target={thread.chatName}
            messages={thread.messages}
            newMessage={newMessage}
            classes={classes}
            setTarget={setTarget}
            thread={thread}
            setThread={setThread}
          ></ThreadMessage>
        )}
        <CreateChannel
          modal={modal}
          userId={userId}
          setModal={setModal}
          createChannel={createChannel}
        />
      </React.Fragment>
    );
  }

  return (
    <div
      className={classes.chatButton}
      onClick={() => {
        setOpen(true);
      }}
    >
      <ChatBubbleOutline />
    </div>
  );
}
