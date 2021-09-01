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
} from "@material-ui/icons";
import moment from "moment";

function KMessageBox({ user, message, time }: TChat) {
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
      <div>
        <div className={classes.userName}>{user}</div>
        <div className={classes.textWrapper}>
          <span className={classes.messageText}>{message}</span>
          <span className={classes.time}>{timeText}</span>
        </div>
      </div>
    </div>
  );
}

function KMessageReverseBox({ message, time }: TChat) {
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

interface TRoom {
  room: string;
}

function Home({
  setOpen,
  setTarget,
  targetList,
  classes,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTarget: React.Dispatch<React.SetStateAction<string>>;
  targetList: string[];
  classes: any;
}) {
  return (
    <div className={classes.messenger}>
      <div className={classes.wrapper}>
        <div className={classes.homeHeader}>
          <div className={classes.backspace}></div>
          <div className={classes.opponent}>
            <div className={classes.name}>Chatting</div>
            <div className={classes.online}>
              <FiberManualRecord /> online
            </div>
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
              target={v}
              setTarget={setTarget}
              classes={classes}
            />
          ))}
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

function Room({
  setOpen,
  sendMessage,
  target,
  messages,
  newMessage,
  classes,
  setTarget,
  userId,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sendMessage: (target: string, msg: string) => void;
  target: string;
  messages: TChat[];
  newMessage: boolean;
  classes: any;
  setTarget: React.Dispatch<React.SetStateAction<string>>;
  userId: string;
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
            <div className={classes.online}>
              <FiberManualRecord /> 현재 활동중
            </div>
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

function renderMessage(messages: TChat[], classes: any, userId: string) {
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

interface TChat {
  user: string;
  time: string;
  message: string;
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
  const [targetList, setTargetList] = useState<string[]>([]);
  const [messages, setMessages] = useState<TChat[]>([]);
  const [newMessage, setNewMessage] = useState<boolean>(false);

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
              const valueList: string[] = [];
              message.data.map((v: any, i: number) => {
                valueList.push(v.chatName);
              });
              setTargetList(valueList);
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
                  time: getTime(),
                },
              ]);
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
          ></Room>
        )}
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
