import React, { useState } from "react";
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

function KMessageBox() {
  const classes = messengerStyle();

  return (
    <div className={classes.messageBox}>
      <div className={classes.user}></div>
      <div>
        <div className={classes.userName}>kim</div>
        <div className={classes.textWrapper}>
          <span className={classes.messageText}>
            gna. Sed consequat, leo eget bibendum sodales, augue velit cursus
            nunc,
          </span>
          <span className={classes.time}>AM 11:51</span>
        </div>
      </div>
    </div>
  );
}

function KMessageReverseBox() {
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
        <div className={classes.messageText}>
          gna. Sed consequat, leo eget bibendum sodales, augue velit cursus
          nunc,
        </div>
        <span className={classes.time}>AM 11:51</span>
      </div>
    </div>
  );
}

function Home() {
  const classes = messengerStyle();

  return <div></div>;
}

function Row() {
  const classes = messengerStyle();

  return (
    <div className={classes.row}>
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

  if (open) {
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
          <div className={classes.homeBody}>
            <Row />
            <Row />
            <Row />
            <Row />
            <Row /> <Row />
            <Row />
            <Row />
            <Row />
            <Row /> <Row />
            <Row />
            <Row />
            <Row />
            <Row />
          </div>
          <div className={classes.homeFooter}></div>
        </div>
      </div>
    );
  }

  if (open) {
    return (
      <div className={classes.messenger}>
        <div className={classes.wrapper}>
          <div className={classes.header}>
            <div className={classes.back}>
              <NavigateBefore />
            </div>
            <div className={classes.opponent}>
              <div className={classes.name}>김진구</div>
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
              <div className={classes.timeWrapper}>
                <div className={classes.dayBoundary}></div>
                <div className={classes.timeTicket}>어제</div>
              </div>
              <KMessageBox />
              <KMessageBox />
              <KMessageReverseBox />
              <KMessageBox />
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
