import React, { useEffect } from "react";
import { useState } from "react";
import { chatStyle } from "../../../styles/service/chat/chat";
import {
  RadioButtonUnchecked,
  ArrowDropDown,
  FiberManualRecord,
} from "@material-ui/icons";
import Messenger from "./messenger";

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

function MessageBox() {
  const classes = chatStyle();

  return (
    <div className={classes.messageBox}>
      <div className={classes.user}></div>
      <div>
        <div className={classes.name}>kim</div>
        <div className={classes.textWrapper}>
          <span className={classes.messageText}>
            gna. Sed consequat, leo eget bibendum sodales, augue velit cursus
            nunc, gna. Sed consequat, leo eget bibendum sodales, augue velit
            cursus nunc,
          </span>
          <span className={classes.time}>AM 11:51</span>
        </div>
      </div>
    </div>
  );
}

function MessageReverseBox() {
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
        <div className={classes.messageText}>
          gna. Sed consequat, leo eget bibendum sodales, augue velit cursus
          nunc,
        </div>
        <span className={classes.time}>AM 11:51</span>
      </div>
    </div>
  );
}

export default function Chat() {
  const classes = chatStyle();
  const [chatList, setChatList] = useState<TChat[]>([]);

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
          <div className={`${classes.channel} ${classes.join}`}>
            <span className={classes.box}>#</span>
            <span>backend</span>
          </div>
          <div className={`${classes.channel} ${classes.join}`}>
            <span className={classes.box}>#</span>
            <span>frontend</span>
          </div>
          <div className={`${classes.channel} ${classes.unjoin}`}>
            <span>
              <span className={classes.box}>+</span>
              <span>designer</span>
            </span>
            <span className={classes.deleteChannel}>X</span>
          </div>
          <div className={`${classes.channel} ${classes.unjoin}`}>
            <span>
              <span className={classes.box}>+</span>
              <span>project</span>
            </span>
            <span className={classes.deleteChannel}>X</span>
          </div>
          <div className={classes.channel}>
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
          <div className={classes.direct}>
            <div className={classes.directUserWrapper}>
              <div className={classes.directUser}></div>
              <div className={classes.directName}>Slackbot</div>
            </div>
            <span className={classes.deleteChannel}>X</span>
          </div>
          <div className={classes.direct}>
            <div className={classes.directUserWrapper}>
              <div className={classes.directUser}></div>
              <div className={classes.directName}>Slackbot</div>
            </div>
            <span className={classes.deleteChannel}>X</span>
          </div>
          <div className={classes.direct}>
            <div className={classes.directUserWrapper}>
              <div className={classes.directUser}></div>
              <div className={classes.directName}>Slackbot</div>
            </div>
            <span className={classes.deleteChannel}>X</span>
          </div>
          <div className={classes.direct}>
            <div className={classes.directUserWrapper}>
              <div className={classes.directUser}></div>
              <div className={classes.directName}>Slackbot</div>
            </div>
            <span className={classes.deleteChannel}>X</span>
          </div>
          <div className={classes.direct}>
            <div className={classes.directUserWrapper}>
              <div className={classes.directUser}></div>
              <div className={classes.directName}>Slackbot</div>
            </div>
            <span className={classes.deleteChannel}>X</span>
          </div>
          <div className={classes.direct}>
            <div className={classes.directUserWrapper}>
              <div className={classes.directUser}></div>
              <div className={classes.directName}>Slackbot</div>
            </div>
            <span className={classes.deleteChannel}>X</span>
          </div>
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
            <MessageBox />
            <MessageReverseBox />
            <MessageBox />
            <MessageReverseBox />
            <MessageBox /> <MessageReverseBox />
            <MessageBox /> <MessageBox />
            <MessageReverseBox />
            <MessageBox />
            <DayBoundary text="yesterday" />
            <MessageReverseBox />
            <MessageBox /> <MessageReverseBox />
            <MessageBox /> <MessageBox />
            <MessageReverseBox />
            <MessageBox />
            <MessageReverseBox />
            <MessageBox /> <MessageReverseBox />
            <MessageBox />
          </div>
        </div>
        <div className={classes.input}>
          <input type="text" />
          <div className={classes.entering}>
            <span className={classes.enterIcon}>
              <FiberManualRecord />
              <FiberManualRecord />
              <FiberManualRecord />
            </span>
            <span className={classes.enterText}>kim is typing...</span>
          </div>
        </div>
      </div>
      <Messenger />
    </div>
  );
}
