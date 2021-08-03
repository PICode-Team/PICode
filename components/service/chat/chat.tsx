/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import {
  chatStyle,
  createChannelStyle,
} from "../../../styles/service/chat/chat";
import {
  RadioButtonUnchecked,
  ArrowDropDown,
  FiberManualRecord,
  Close,
} from "@material-ui/icons";
import CustomButton from "../../items/input/button";
import moment from "moment";
import CustomTextField from "../../items/input/textfield";

function getTime(
  time: Date | string | undefined = undefined,
  format: string = "YYYY-MM-DD HH:mm:ss"
) {
  return moment(time).format(format);
}

interface TChat {
  user: string;
  time: string;
  message: string;
}

interface TDayBoundary {
  text: string;
}

function DayBoundary({ text }: TDayBoundary) {
  const classes = chatStyle();

  return (
    <div className={classes.timeWrapper}>
      <div className={classes.dayBoundary}></div>
      <div className={classes.timeTicket}>{text}</div>
    </div>
  );
}

function MessageBox({ user, message, time }: TChat) {
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
      <div className={classes.user}></div>
      <div>
        <div className={classes.name}>{user}</div>
        <div className={classes.textWrapper}>
          <span className={classes.messageText}>{message}</span>
          <span className={classes.time}>{timeText}</span>
        </div>
      </div>
    </div>
  );
}

function MessageReverseBox({ message, time }: TChat) {
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
      <div
        className={classes.textWrapper}
        style={{ display: "flex", flexDirection: "row-reverse" }}
      >
        <div className={classes.messageText}>{message}</div>
        <span className={classes.time}>{timeText}</span>
      </div>
    </div>
  );
}

type TUser = {
  [key in string]: boolean;
};

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
  const nameRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState<string>("");
  const [users, setUsers] = useState<TUser>({});
  const descriptionRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const userList = ["1", "2", "3"].reduce((a: TUser, c: string) => {
      if (c === userId) return a;
      return { ...a, [c]: false };
    }, {});

    // setUsers(userList)
  }, []);

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
            placeholder="Channel Name"
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
          <div className={classes.participantWrapper}>
            {Object.keys(users).map((v, i) => (
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
          <CustomButton
            text="CREATE"
            width="76px"
            onClick={() => {
              const participant = Object.keys(users).filter((v) => users[v]);

              createChannel(name, description, participant);
              setName("");
              setDescription("");
              setModal(false);
            }}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export interface TSocketPacket {
  category: "chat" | "connect";
  type: string;
  data: any;
}

export default function Chat(ctx: any) {
  const classes = chatStyle();
  const [messages, setMessages] = useState<TChat[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [typing, setTyping] = useState<string[]>([]);
  const [target, setTarget] = useState<string>("");
  const [channelList, setChannelList] = useState<string[]>([]);
  const [directList, setDirectList] = useState<string[]>([]);
  const messageRef = useRef<HTMLInputElement>(null);

  function sendMessage(target: string, msg: string) {
    if (ctx.ws.current) {
      ctx.ws.current.send(
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

  function enterEvent(event: KeyboardEvent) {
    if (event.key === "Enter") {
      if (
        messageRef.current &&
        target !== "" &&
        messageRef.current.value !== ""
      ) {
        sendMessage(target, messageRef.current.value);
        messageRef.current.value = "";
      }
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

  useEffect(() => {
    setMessages([]);

    if (target !== "") {
      getChatLogList(target);
    }
  }, [target]);

  useEffect(() => {}, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const target = document.getElementById("contentBox");
      target?.scrollTo(0, target.clientHeight);
    }
  }, [messages]);

  useEffect(() => {
    if (ctx.ws === null) return;

    if (ctx.ws.current) {
      if (channelList.length === 0 && directList.length === 0) getChat();

      ctx.ws.current.onmessage = (msg: any) => {
        const message = JSON.parse(msg.data);

        if (message.category === "chat") {
          switch (message.type) {
            case "createChannel":
              getChat();
              break;
            case "getChat":
              const channelList: string[] = [];
              const directList: string[] = [];

              message.data.forEach((v: any) => {
                if (v.chatName.slice(0, 1) === "#") {
                  channelList.push(v.chatName);
                } else {
                  directList.push(v.chatName);
                }
              });

              setChannelList(channelList);
              setDirectList(directList);
              break;

            case "getChatLog":
              const messageList: TChat[] = [];
              message.data.forEach((v: any) => {
                messageList.push({
                  user: v.sender,
                  message: v.message,
                  time: v.time,
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
              setMessages([
                ...messages,
                {
                  user: message.data.sender,
                  message: message.data.message,
                  time: getTime(),
                },
              ]);
              break;
          }
        }
      };
    }
  }, [ctx.ws.current, messages]);

  useEffect(() => {
    document.addEventListener("keypress", enterEvent);
    return () => {
      document.removeEventListener("keypress", enterEvent);
    };
  }, [target]);

  return (
    <div className={classes.root}>
      <div className={classes.sidebar}>
        <div className={classes.title}>projectName</div>
        <div className={classes.toolWrapper}>
          <div className={classes.tool}>
            <RadioButtonUnchecked />
            Thread
          </div>
          <div className={classes.tool}>
            <RadioButtonUnchecked />
            Direct Message
          </div>
          <div className={classes.tool}>
            <RadioButtonUnchecked />
            Mention
          </div>
          <div className={classes.tool}>
            <RadioButtonUnchecked />
            Connect
          </div>
          <div className={classes.tool}>
            <RadioButtonUnchecked />
            Etc
          </div>
        </div>
        <div className={classes.channelList}>
          <div
            className={classes.channelTitle}
            onClick={(event: React.MouseEvent<HTMLElement>) => {
              (event.currentTarget.parentNode as HTMLElement).classList.toggle(
                classes.open
              );
            }}
          >
            <ArrowDropDown />
            <span>Channel</span>
          </div>
          {channelList.map((v, i) => {
            return (
              <div
                className={`${classes.channel} ${classes.join}`}
                key={`channel-${i}`}
                onClick={() => {
                  setTarget(v);
                }}
              >
                <span>
                  <span className={classes.box}>+</span>
                  <span>{v.replace("#", "")}</span>
                </span>
                <span className={classes.deleteChannel}>X</span>
              </div>
            );
          })}

          <div
            className={classes.channel}
            onClick={() => {
              setModal(true);
            }}
          >
            <span className={classes.addChannel}>+</span>
            Add Channel
          </div>
        </div>
        <div className={classes.directList}>
          <div
            className={classes.directTitle}
            onClick={(event: React.MouseEvent<HTMLElement>) => {
              (event.currentTarget.parentNode as HTMLElement).classList.toggle(
                classes.open
              );
            }}
          >
            <ArrowDropDown />
            <span>Direct Message</span>
          </div>
          {directList.map((v, i) => {
            return (
              <div
                className={classes.direct}
                key={`direct-${i}`}
                onClick={() => {
                  setTarget(v);
                }}
              >
                <div className={classes.directUserWrapper}>
                  <div className={classes.directUser}></div>
                  <div className={classes.directName}>{v.replace("@", "")}</div>
                </div>
                <span className={classes.deleteChannel}>X</span>
              </div>
            );
          })}

          <div className={classes.channel}>
            <span className={classes.addChannel}>+</span>
            Add Colleague
          </div>
        </div>
      </div>
      {target !== "" ? (
        <div className={classes.contentWrapper}>
          <div className={classes.header}>
            <div className={classes.headerInfo}>
              <div className={classes.headerUser}></div>
              <div className={classes.headerName}>{target}</div>
            </div>
            <div className={classes.participant}></div>
          </div>
          <div className={classes.contentBox} id="contentBox">
            <div className={classes.content}>
              {messages.map((v, i) => {
                // if (v.time === "~~") {
                //   return <DayBoundary text={v.time} key={`dayboundary-${i}`} />;
                // }
                if (v.user === ctx.session.userId) {
                  return <MessageReverseBox {...v} key={`messagebox-${i}`} />;
                } else {
                  return <MessageBox {...v} key={`messagebox-${i}`} />;
                }
              })}
            </div>
          </div>
          <div className={classes.input}>
            <input type="text" ref={messageRef} />
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
      ) : (
        <div className={classes.emptyWrapper}>
          <div>Select a target and start the conversation.</div>
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
