import React from "react";
import { useState } from "react";
import { chatStyle } from "../../../styles/service/chat/chat";
import { RadioButtonUnchecked, ArrowDropDown } from "@material-ui/icons";

interface TChat {
  user: string;
  time: string;
  message: string;
}

function MessageBox() {
  const classes = chatStyle();

  return (
    <div className={classes.messageBox}>
      <div className={classes.user}></div>
      <div>
        <div className={classes.info}>
          <span className={classes.name}>김진구</span>
          <span className={classes.time}>오전 8:57</span>
        </div>
        <div className={classes.textWrapper}>
          <div className={classes.messageText}>테스트 텍스트 어쩌고 젖쩌고</div>
          <div className={classes.emojiWrapper}>
            <span className={classes.emoji}></span>
            <span className={classes.addEmoji}></span>
          </div>
        </div>
      </div>
      <div className={classes.interaction}></div>
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
            스레드
          </div>
          <div className={classes.tool}>
            <RadioButtonUnchecked />
            모든 DM
          </div>
          <div className={classes.tool}>
            <RadioButtonUnchecked />
            멘션 및 반응
          </div>
          <div className={classes.tool}>
            <RadioButtonUnchecked />
            Slack Connect
          </div>
          <div className={classes.tool}>
            <RadioButtonUnchecked />더 보기
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
            <span>채널</span>
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
            채널 추가
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
            <span>다이렉트 메시지</span>
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
            팀원 추가
          </div>
        </div>
      </div>
      <div className={classes.content}>
        <div className={classes.header}>
          <div className={classes.headerInfo}>
            <div className={classes.headerUser}></div>
            <div className={classes.headerName}>김진구</div>
          </div>
          <div className={classes.participant}></div>
        </div>
        <div className={classes.contentWrapper}>
          <MessageBox />
          <MessageBox />
          <div className={classes.timeWrapper}>
            <div className={classes.dayBoundary}></div>
            <div className={classes.timeTicket}>어제</div>
          </div>
          <MessageBox />
          <MessageBox />
          <MessageBox />
        </div>
        <div className={classes.input}>
          <input type="text" />
          <div className={classes.entering}></div>
        </div>
      </div>
    </div>
  );
}
