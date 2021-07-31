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
  createChannel,
}: {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  createChannel: (chatName: string) => void;
}) {
  const classes = createChannelStyle();
  const [name, setName] = useState<string>("");
  const nameRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState<string>("");
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
          <CustomTextField
            label="Name"
            ref={nameRef}
            value={name}
            onChange={(event: any) => {
              setName(event.currentTarget.value);
            }}
          />
          <CustomTextField
            label="Description"
            ref={descriptionRef}
            value={description}
            onChange={(event: any) => {
              setDescription(event.currentTarget.value);
            }}
          />
        </div>
        <div className={classes.modalFooter}>
          <CustomButton
            text="CREATE"
            width="76px"
            onClick={() => {
              createChannel(name);
              setName("");
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
  const ws = useRef<WebSocket | null>(null);
  const messageRef = useRef<HTMLInputElement>(null);

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

  function enterEvent(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      if (messageRef.current && target !== "") {
        sendMessage(target, messageRef.current.value);
        messageRef.current.value = "";
      }
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

  function createChannel(chatName: string) {
    if (ws.current) {
      ws.current.send(
        JSON.stringify({
          category: "chat",
          type: "createChannel",
          data: {
            target: ctx.session.id,
            chatName: chatName,
          },
        })
      );
    }
  }

  useEffect(() => {
    if (target !== "") {
      getChatLogList(target);
    }
  }, [target]);

  // useEffect(() => {

  // }, [])

  useEffect(() => {
    if(typeof window !== "undefined") {
      const target = document.getElementById("contentBox")
      target?.scrollTo(0, target.clientHeight)
    }
  }, [])

  useEffect(() => {
    ws.current = new WebSocket(`ws://127.0.0.1:8000/?userId=${ctx.session.userId}`);

    if (ws.current) {
      ws.current!.onopen = (event: any) => {
        ws.current!.send(
          JSON.stringify({
            category: "connect",
          })
        );

        getChat();
      };
    }

    ws.current.onmessage = (msg) => {
      const message = JSON.parse(msg.data);

      if (message.category === "chat") {
        switch (message.type) {
          case "createChannel":
            break;
          case "getChat":
            const channelList: string[] = [];
            const directList: string[] = [];

            message.data.forEach((v: string) => {
              if (v.slice(0, 1) === "#") {
                channelList.push(v);
              } else {
                directList.push(v);
              }
            });

            setChannelList(channelList);
            setDirectList(directList);
            break;

          case "getChatLog":
            const messageList: TChat[] = [];
            message.data.forEach((v: any) => {
              messageList.push({ user: v.target, message: v.msg, time: "" });
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
              { user: message.target, message: message.msg, time: "" },
            ]);
            break;
        }
      }
    };

    document.addEventListener("keypress", enterEvent);
    return () => {
      document.removeEventListener("keypress", enterEvent);
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

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
      {target === "" ? (
        <div className={classes.contentWrapper}>
          <div className={classes.header}>
            <div className={classes.headerInfo}>
              <div className={classes.headerUser}></div>
              <div className={classes.headerName}>kim</div>
            </div>
            <div className={classes.participant}></div>
          </div>
          <div className={classes.contentBox} id="contentBox">
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
              <MessageBox time="4555" message="123123" user="test" />
              <MessageBox time="4555" message="123123" user="test" />
              <MessageBox time="4555" message="123123" user="test" />
              <MessageBox time="4555" message="123123" user="test" />
              <MessageBox time="4555" message="123123" user="test" />
              <MessageBox time="4555" message="123123" user="test" />
              <MessageBox time="4555" message="123123" user="test" />
              <MessageBox time="4555" message="123123" user="test" />
              <MessageBox time="4555" message="123123" user="test" />
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
        setModal={setModal}
        createChannel={createChannel}
      />
    </div>
  );
}
