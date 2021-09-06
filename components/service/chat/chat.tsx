/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import {
  chatStyle,
  createChannelStyle,
} from "../../../styles/service/chat/chat";
import {
  FiberManualRecord,
  Close,
  Search,
  Add,
  Clear,
  FormatBold,
  FormatItalic,
  FormatStrikethrough,
  Code,
  FormatListNumbered,
  Link,
  FormatListBulleted,
  AttachFile,
  SentimentSatisfiedOutlined,
  AlternateEmail,
  TextFormatOutlined,
  Send,
  SmsOutlined,
  FavoriteBorderOutlined,
} from "@material-ui/icons";
import moment from "moment";

interface IChat {
  user: string;
  time: string;
  message: string;
  chatId: string;
  threadList: IChat[];
}

interface IDayBoundary {
  text: string;
}

interface IChannel {
  chatName?: string;
  userId?: string;
  chatParticipant: string[];
  creation: string;
  description: string;
}

interface IThread {
  parentUser: string;
  parentMessage: string;
  chatName: string;
  messages: IChat[];
  parentId: string;
  parentTime: string;
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
            value={name || ""}
            className={classes.input}
            onChange={(event: any) => {
              setName(event.currentTarget.value);
            }}
          />
          <input
            type="text"
            placeholder="Description"
            ref={descriptionRef}
            value={description || ""}
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
              defaultChecked={isDirect}
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

export default function Chat(ctx: any) {
  const classes = chatStyle();
  const [messages, setMessages] = useState<IChat[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [typing, setTyping] = useState<string[]>([]);
  const [target, setTarget] = useState<string>("");
  const [channelList, setChannelList] = useState<IChannel[]>([]);
  const [newMessage, setNewMessage] = useState<boolean>(false);
  const [thread, setThread] = useState<IThread | undefined>(undefined);
  const messageRef = useRef<HTMLInputElement>(null);
  const threadMessageRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const threadEndRef = useRef<HTMLInputElement>(null);
  const [userList, setUserList] = React.useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== undefined) {
      const pathList = window.location.href.split("target=");
      if (pathList.length > 1) {
        setTarget(pathList[pathList.length - 1]);
      }
    }
  });

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

  function handleResize() {
    if (document.getElementsByClassName(classes.newMessage).length > 0) {
      (
        document.getElementsByClassName(classes.newMessage)[0] as HTMLElement
      ).style.top = `${(Number(messageRef.current?.offsetTop) ?? 0) - 44}px`;
    }
  }

  function sendMessage(target: string, message: string, parentChatId?: string) {
    if (ctx.ws.current) {
      ctx.ws.current.send(
        JSON.stringify({
          category: "chat",
          type: "sendMessage",
          data: {
            target,
            message,
            parentChatId,
          },
        })
      );
    }
  }

  function getChat() {
    if (ctx.ws.current) {
      ctx.ws.current.send(
        JSON.stringify({
          category: "chat",
          type: "getChat",
        })
      );
    }
  }

  function getChatLog(target: string, page: string) {
    if (ctx.ws.current) {
      ctx.ws.current.send(
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
    if (ctx.ws.current) {
      ctx.ws.current.send(
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
    if (ctx.ws.current) {
      ctx.ws.current.send(
        JSON.stringify({
          category: "chat",
          type: "createChannel",
          data: {
            target: chatName,
            description: description,
            chatParticipant: [ctx.session.userId, ...(participant ?? [])],
          },
        })
      );
    }
  }

  function DayBoundary({ text }: IDayBoundary) {
    const classes = chatStyle();

    return (
      <div className={classes.timeWrapper}>
        <div className={classes.dayBoundary}></div>
        <div className={classes.timeTicket}>{text}</div>
      </div>
    );
  }

  function MessageBox({ user, message, time, chatId, threadList }: IChat) {
    const classes = chatStyle();
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
        <div
          className={classes.thumbnail}
          style={{
            backgroundImage:
              userList.find((v) => v.userId === user)?.userThumbnail ===
                undefined
                ? "none"
                : ` url('http://localhost:8000/api/temp/${userList.find((v) => v.userId === user)?.userThumbnail
                }')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
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

  function MessageReverseBox({
    message,
    time,
    chatId,
    threadList,
    user,
  }: IChat) {
    const classes = chatStyle();
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

  function renderMessage(
    messages: IChat[],
    classes: any,
    userId: string,
    isThread: boolean
  ) {
    const value = [];

    for (let i = 0; i < messages.length; i++) {
      const dayCheck =
        i === 0 ||
        (messages[i].time !== undefined &&
          messages[i - 1].time.split(" ")[0] !==
          messages[i].time.split(" ")[0]);

      if (!isThread && dayCheck === true) {
        value.push(<DayBoundary text={messages[i].time.split(" ")[0]} />);
      }

      if (messages[i].user === userId) {
        value.push(
          <MessageReverseBox {...messages[i]} key={`messagebox-${i}`} />
        );
      } else {
        value.push(<MessageBox {...messages[i]} key={`messagebox-${i}`} />);
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
    setMessages([]);

    if (target !== "") {
      getChatLogList(target);
    }
  }, [target]);

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

  useEffect(() => {
    getParticipantList();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    document.addEventListener("keypress", enterEvent);
    return () => {
      document.removeEventListener("keypress", enterEvent);
    };
  }, [target]);

  useEffect(() => {
    if (ctx.ws === null) return;

    if (ctx.ws.current) {
      if (channelList.length === 0) {
        getChat();
      }

      ctx.ws.current.addEventListener("message", onMessageHandler);
    }
  }, [ctx.ws.current, messages]);

  const onMessageHandler = (msg: any) => {
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

          setChannelList(channelList);
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
            if (message.data.sender !== ctx.session.userId) {
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
                time: message.data.time ?? getTime(),
                chatId: message.data.chatId ?? "",
                threadList: message.data.threadList ?? [],
              },
            ]);
          }

          break;
      }
    }
  };

  function getTime(
    time: Date | string | undefined = undefined,
    format: string = "YYYY-MM-DD HH:mm:ss"
  ) {
    return moment(time).format(format);
  }

  return (
    <div className={classes.root}>
      <div className={classes.sidebar}>
        <div className={classes.sidebarHeader}>
          <div className={classes.search}>
            <Search />
            <input type="text" placeholder="Search User or Channel" />
          </div>
        </div>
        <div className={classes.sidebarContent}>
          {channelList.map((v, i) => {
            return (
              <div
                className={classes.channel}
                key={`channel-${i}`}
                onClick={() => {
                  setTarget(v.chatName ?? v.userId!);
                }}
              >
                <div
                  className={classes.channelThumbnail}
                  style={{
                    backgroundImage:
                      userList.find((user) => user.userId === v.chatName)
                        ?.userThumbnail === undefined
                        ? "url('/images/picode-7.svg')"
                        : `url('http://localhost:8000/api/temp/${userList.find((user) => user.userId === v.chatName)
                          ?.userThumbnail
                        }')`,
                    backgroundSize:
                      userList.find((user) => user.userId === v.chatName)
                        ?.userThumbnail === undefined
                        ? "contain"
                        : "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                ></div>
                <div className={classes.channelBody}>
                  <div className={classes.channelInfo}>
                    <span className={classes.channelName}>
                      {v.chatName ?? v.userId!}
                    </span>
                    <span className={classes.channelParticipant}>
                      {v.chatName?.includes("#") &&
                        `(${v.chatParticipant.join(", ")})`}
                    </span>
                  </div>
                  <div className={classes.lastContent}>
                    {v.description ?? "this chat has no description"}
                  </div>
                </div>
                <div className={classes.channelTail}>
                  <div className={classes.unreadMessage}></div>
                  <div className={classes.lastTime}>44 minutes</div>
                </div>
              </div>
            );
          })}
          <div
            className={classes.createChannel}
            onClick={() => {
              setModal(true);
            }}
          >
            <Add />
          </div>
        </div>
      </div>
      {target !== "" ? (
        <div className={classes.contentWrapper}>
          <div className={classes.contentHeader}>
            <div className={classes.targetThubnail}></div>
            <div className={classes.targetInfo}>
              <div className={classes.targetName}>{target}</div>
              <div className={classes.targetLast}>44 minutes later</div>
            </div>
            <div className={classes.targetParticipant}></div>
          </div>
          <div className={classes.content}>
            <div className={classes.contentBox}>
              {renderMessage(messages, classes, ctx.session.userId, false)}
              <div ref={endRef} />
            </div>
          </div>
          <div className={classes.input}>
            <div className={classes.inputBox}>
              <input type="text" ref={messageRef} />
              <div className={classes.interaction}>
                <div>
                  <div>
                    <FormatBold />
                  </div>
                  <div>
                    <FormatItalic />
                  </div>
                  <div>
                    <FormatStrikethrough style={{ marginRight: "1px" }} />
                  </div>
                  <div>
                    <Code style={{ marginRight: "4px" }} />
                  </div>
                  <div>
                    <Link style={{ marginRight: "1px" }} />
                  </div>
                  <div>
                    <FormatListNumbered style={{ marginRight: "4px" }} />
                  </div>
                  <div>
                    <FormatListBulleted />
                  </div>
                </div>
                <div>
                  <div>
                    <TextFormatOutlined style={{ marginRight: "1px" }} />
                  </div>
                  <div>
                    <AlternateEmail style={{ marginRight: "4px" }} />
                  </div>
                  <div>
                    <SentimentSatisfiedOutlined
                      style={{ marginRight: "4px" }}
                    />
                  </div>
                  <div>
                    <AttachFile style={{ marginRight: "4px" }} />
                  </div>
                  <div
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
            {typing.length > 0 && (
              <div className={classes.entering}>
                <span className={classes.enterIcon}>
                  <FiberManualRecord />
                  <FiberManualRecord />
                  <FiberManualRecord />
                </span>
                <span className={classes.enterText}>
                  {`${typing.map((v) => `${v} `)}is typing...`}
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={classes.emptyWrapper}>
          Select a channel and start the conversation.
        </div>
      )}
      {thread !== undefined && (
        <div className={classes.activitybar}>
          <div className={classes.activitybarHeader}>
            <span>
              <span className={classes.activitybarTitle}>Thread</span>
              <span className={classes.activitybarTarget}>#project</span>
            </span>
            <span
              className={classes.activitybarClose}
              onClick={() => {
                setThread(undefined);
              }}
            >
              <Clear />
            </span>
          </div>
          <div className={classes.activitybarContent}>
            <div className={classes.contentBox}>
              <MessageBox
                user={thread.parentUser}
                message={thread.parentMessage}
                time={thread.parentTime}
                threadList={[]}
                chatId=""
              />
              {thread.messages.length > 0 && (
                <DayBoundary text={`${thread.messages.length} replies`} />
              )}
              {renderMessage(
                thread.messages,
                classes,
                ctx.session.userId,
                true
              )}
              <div ref={threadEndRef} />
            </div>
            <div className={classes.input}>
              <div className={classes.inputBox}>
                <input type="text" ref={threadMessageRef} />
                <div className={classes.interaction}>
                  <div>
                    <div>
                      <FormatBold />
                    </div>
                    <div>
                      <FormatItalic />
                    </div>
                    <div>
                      <FormatStrikethrough style={{ marginRight: "1px" }} />
                    </div>
                    <div>
                      <Code style={{ marginRight: "4px" }} />
                    </div>
                    <div>
                      <Link style={{ marginRight: "1px" }} />
                    </div>
                    <div>
                      <FormatListNumbered style={{ marginRight: "4px" }} />
                    </div>
                    <div>
                      <FormatListBulleted />
                    </div>
                  </div>
                  <div>
                    <div>
                      <TextFormatOutlined style={{ marginRight: "1px" }} />
                    </div>
                    <div>
                      <AlternateEmail style={{ marginRight: "4px" }} />
                    </div>
                    <div>
                      <SentimentSatisfiedOutlined
                        style={{ marginRight: "4px" }}
                      />
                    </div>
                    <div>
                      <AttachFile style={{ marginRight: "4px" }} />
                    </div>
                    <div
                      onClick={() => {
                        if (
                          threadMessageRef.current &&
                          threadMessageRef.current.value !== ""
                        ) {
                          sendMessage(
                            thread.chatName,
                            threadMessageRef.current?.value ?? "",
                            thread.parentId
                          );
                          threadMessageRef.current.value = "";
                          threadEndRef.current!.scrollIntoView();
                        }
                      }}
                    >
                      <Send />
                    </div>
                  </div>
                </div>
              </div>

              {typing.length > 0 && (
                <div className={classes.entering}>
                  <span className={classes.enterIcon}>
                    <FiberManualRecord />
                    <FiberManualRecord />
                    <FiberManualRecord />
                  </span>
                  <span className={classes.enterText}>
                    {`${typing.map((v) => `${v} `)} is typing...`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <CreateChannel
        modal={modal}
        userId={ctx.session.userId}
        setModal={setModal}
        createChannel={createChannel}
      />
    </div>
  );
}
