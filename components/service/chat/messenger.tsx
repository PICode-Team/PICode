import React, { useEffect, useState } from "react";
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

function KMessageBox({ sender, text, time }: TMessage) {
  const classes = messengerStyle();

  return (
    <div className={classes.messageBox}>
      <div className={classes.user}></div>
      <div>
        <div className={classes.userName}>{sender}</div>
        <div className={classes.textWrapper}>
          <span className={classes.messageText}>{text}</span>
          <span className={classes.time}>{time}</span>
        </div>
      </div>
    </div>
  );
}

function KMessageReverseBox({ text, time }: TMessage) {
  const classes = messengerStyle();

  return (
    <div
      className={classes.messageBox}
      style={{ display: "flex", justifyContent: "flex-end" }}
    >
      <div
        className={classes.textWrapper}
        style={{ display: "flex", flexDirection: "row-reverse" }}
      >
        <div className={classes.messageText}>{text}</div>
        <span className={classes.time}>{time}</span>
      </div>
    </div>
  );
}

interface TRoom {
  room: string;
}

function Home({
  setOpen,
  setRoom,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
}) {
  const classes = messengerStyle();
  const [roomList, setRoomList] = useState<TRoom[]>([]);

  useEffect(() => {
    setRoomList([
      { room: "1" },
      { room: "2" },
      { room: "3" },
      { room: "4" },
      { room: "5" },
      { room: "6" },
      { room: "7" },
      { room: "8" },
    ]);
  }, []);

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
          {roomList.map((v, i) => (
            <Row key={`messenger-row-${i}`} room={v.room} setRoom={setRoom} />
          ))}
        </div>
        <div className={classes.homeFooter}></div>
      </div>
    </div>
  );
}

function DayBoundary({ time }: { time: string }) {
  const classes = messengerStyle();

  return (
    <div className={classes.timeWrapper}>
      <div className={classes.dayBoundary}></div>
      <div className={classes.timeTicket}>어제</div>
    </div>
  );
}

interface TMessage {
  sender: string;
  text: string;
  time: string;
}

function Room({
  room,
  setOpen,
  setRoom,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  room: string;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
}) {
  const classes = messengerStyle();
  const [messageList, setMessageList] = useState<TMessage[]>([]);

  useEffect(() => {
    setMessageList([
      {
        sender: "me",
        text: "gna. Sed consequat, leo eget bibendum sodales, augue velit cursusnunc",
        time: "AM 11:51",
      },
      {
        sender: "test",
        text: "gna. Sed consequat, leo eget bibendum sodales, augue velit cursusnunc",
        time: "AM 11:51",
      },
      {
        sender: "me",
        text: "gna. Sed consequat, leo eget bibendum sodales, augue velit cursusnunc",
        time: "AM 11:51",
      },
      {
        sender: "test",
        text: "gna. Sed consequat, leo eget bibendum sodales, augue velit cursusnunc",
        time: "AM 11:51",
      },
      {
        sender: "me",
        text: "gna. Sed consequat, leo eget bibendum sodales, augue velit cursusnunc",
        time: "AM 11:51",
      },
      {
        sender: "test",
        text: "gna. Sed consequat, leo eget bibendum sodales, augue velit cursusnunc",
        time: "AM 11:51",
      },
      {
        sender: "me",
        text: "gna. Sed consequat, leo eget bibendum sodales, augue velit cursusnunc",
        time: "AM 11:51",
      },
      {
        sender: "test",
        text: "gna. Sed consequat, leo eget bibendum sodales, augue velit cursusnunc",
        time: "AM 11:51",
      },
      {
        sender: "me",
        text: "gna. Sed consequat, leo eget bibendum sodales, augue velit cursusnunc",
        time: "AM 11:51",
      },
      {
        sender: "test",
        text: "gna. Sed consequat, leo eget bibendum sodales, augue velit cursusnunc",
        time: "AM 11:51",
      },
      {
        sender: "me",
        text: "gna. Sed consequat, leo eget bibendum sodales, augue velit cursusnunc",
        time: "AM 11:51",
      },
      {
        sender: "test",
        text: "gna. Sed consequat, leo eget bibendum sodales, augue velit cursusnunc",
        time: "AM 11:51",
      },
    ]);
  }, []);

  return (
    <div className={classes.messenger}>
      <div className={classes.wrapper}>
        <div className={classes.header}>
          <div
            className={classes.back}
            onClick={() => {
              setRoom("");
            }}
          >
            <NavigateBefore />
          </div>
          <div className={classes.opponent}>
            <div className={classes.name}>{room}</div>
            <div className={classes.online}>
              <FiberManualRecord /> 현재 활동중
            </div>
          </div>
          <div className={classes.expand}>
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
            {messageList.map((v, i) => {
              if (v.time === "") {
                return <DayBoundary time={v.time} />;
              }
              if (v.sender === "me") {
                return <KMessageReverseBox {...v} key={`messenger-${i}`} />;
              } else {
                return <KMessageBox {...v} key={`messenger-${i}`} />;
              }
            })}
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
          />
          <div className={classes.send}>
            <Send />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  room,
  setRoom,
}: {
  room: string;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
}) {
  const classes = messengerStyle();

  return (
    <div
      className={classes.row}
      onClick={() => {
        setRoom(room);
      }}
    >
      <div className={classes.users}></div>
      <div className={classes.titleWrapper}>
        <div className={classes.title}>
          <div className={classes.titleText}>test title text</div>
          <div className={classes.participant}>4</div>
          <div className={classes.etc}></div>
        </div>
        <div className={classes.thumbnail}>
          gna. Sed consequat, leo eget bibendum sodales, augue velit cu
        </div>
      </div>
      <div className={classes.chatInfo}>
        <div className={classes.lastTime}>AM 12:32</div>
        <div className={classes.count}>231</div>
      </div>
    </div>
  );
}

export default function Messenger() {
  const classes = messengerStyle();
  const [open, setOpen] = useState<boolean>(false);
  const [room, setRoom] = useState<string>("");
  const [load, setLoad] = useState<boolean>(false);

  useEffect(() => {
    setLoad(true);
  }, []);

  if (!load) return <React.Fragment />;

  if (window.location.href.indexOf("chat") !== -1) return <React.Fragment />;

  if (open) {
    return (
      <React.Fragment>
        {room === "" ? (
          <Home setOpen={setOpen} setRoom={setRoom}></Home>
        ) : (
          <Room setOpen={setOpen} room={room} setRoom={setRoom}></Room>
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
