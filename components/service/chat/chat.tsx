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
import CustomTextField from "../../items/input/textfield";

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

  return (
    <div className={classes.messageBox}>
      <div className={classes.user}></div>
      <div>
        <div className={classes.name}>{user}</div>
        <div className={classes.textWrapper}>
          <span className={classes.messageText}>{message}</span>
          <span className={classes.time}>{time}</span>
        </div>
      </div>
    </div>
  );
}

function MessageReverseBox({ message, time }: TChat) {
  const classes = chatStyle();

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
        <span className={classes.time}>{time}</span>
      </div>
    </div>
  );
}

function CreateChannel({
  modal,
  setModal,
}: {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const classes = createChannelStyle();
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

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
          <CustomTextField label="Name" ref={nameRef} />
          <CustomTextField label="Description" ref={descriptionRef} />
        </div>
        <div className={classes.modalFooter}>
          <CustomButton
            text="CREATE"
            width="76px"
            onClick={() => {
              if (nameRef.current && descriptionRef.current) {
                // if (ws.current && ws.current.CONNECTING) {
                //   ws.current.send(
                //     JSON.stringify({
                //       category: "chat",
                //       type: "createChannel",
                //       data: {
                //         target: target,
                //         chatName: nameRef.current.value
                //       },
                //     })
                //   );
                // }
              }
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
  const [channelList, setChannelList] = useState<string[]>([
    "#frontend",
    "#backend",
    "#designer",
    "#project",
  ]);
  const [directList, setDirectList] = useState<string[]>([
    "@kim",
    "@lee",
    "@oh",
    "@park",
  ]);
  const ws = useRef<WebSocket | null>(null);
  const messageRef = useRef<HTMLInputElement>(null);

  function sendMessage(target: string, msg: string) {
    if (ws.current && ws.current.CONNECTING) {
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

  function enterEvent(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      if (messageRef.current && target !== "") {
        sendMessage(target, messageRef.current.value);
        messageRef.current.value = "";
      }
    }
  }

  async function getChat() {
    if (ws.current && ws.current.CONNECTING) {
      await ws.current.send(
        JSON.stringify({
          category: "chat",
          type: "getChat",
        })
      );
    }
  }

  async function getChatLog(target: string, page: string) {
    if (ws.current && ws.current.CONNECTING) {
      await ws.current.send(
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

  async function getChatLogList(target: string) {
    if (ws.current && ws.current.CONNECTING) {
      await ws.current.send(
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

  useEffect(() => {
    ws.current = new WebSocket("ws://192.168.0.23:4000/");
    ws.current.onmessage = (msg) => {
      if (msg.type === "chat") {
        const message = JSON.parse(msg.data);
        setMessages([
          ...messages,
          { user: message.target, message: message.msg, time: "" },
        ]);
      }
    };

    if (ws.current.CONNECTING) {
      getChat();
      // setChannelList()
      // setDirectList()
      // getChatLogList()
      // setMessages()
    }

    document.addEventListener("keypress", enterEvent);

    return () => {
      document.removeEventListener("keypress", enterEvent);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [ws]);

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
      <div className={classes.contentWrapper}>
        <div className={classes.header}>
          <div className={classes.headerInfo}>
            <div className={classes.headerUser}></div>
            <div className={classes.headerName}>kim</div>
          </div>
          <div className={classes.participant}></div>
        </div>
        <div className={classes.contentBox}>
          <div className={classes.content}>
            {messages.map((v, i) => {
              if (v.time === "~~") {
                return <DayBoundary text={v.time} key={`dayboundary-${i}`} />;
              }
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
      <CreateChannel modal={modal} setModal={setModal} />
    </div>
  );
}
