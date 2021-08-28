import { Close } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { userModalStyle } from "../../../styles/service/project/create";
import { IProjectInfo } from "./create";

export interface IUser {
  userId: string;
  userName: string;
  userThumbnail?: string;
}

export default function Modal({
  modal,
  setModal,
  participantList,
  defaultInput,
  setDefualtInput,
}: {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  participantList: IUser[];
  setParticipantList: React.Dispatch<React.SetStateAction<IUser[]>>;
  defaultInput: IProjectInfo;
  setDefualtInput: React.Dispatch<React.SetStateAction<IProjectInfo>>;
}) {
  const classes = userModalStyle();
  const [tempList, setTempList] = useState<IUser[]>([]);

  useEffect(() => {
    if (modal === true) {
      const addedList: IUser[] = [];

      defaultInput.projectParticipants?.forEach((id) => {
        participantList.forEach((info) => {
          if (info.userId === id) addedList.push(info);
        });
      });

      setTempList(addedList);
    }
  }, [modal]);

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
          <div className={classes.inputWrapper}>
            <div className={classes.input}>
              <input type="text" placeholder="Search participant" />
            </div>
            <div className={classes.addButton}>
              <button
                onClick={() => {
                  setDefualtInput({
                    ...defaultInput,
                    projectParticipants: tempList.map((v) => v.userId),
                  });

                  setModal(false);
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
        <div className={classes.addedWrapper}>
          {tempList.map((v, i) => (
            <div className={classes.addedItem} key={`addedItem-${i}`}>
              {v.userName}
              <div
                onClick={() => {
                  setTempList(
                    tempList.filter((item) => v.userId !== item.userId)
                  );
                }}
              >
                <Close />
              </div>
            </div>
          ))}
        </div>
        <div className={classes.modalBody}>
          <div className={classes.subTitle}>User List</div>
          <div className={classes.userList}>
            {participantList
              .filter((item) => {
                let check = true;
                tempList.forEach((v) => {
                  if (v.userId === item.userId) check = false;
                });
                return check;
              })
              .map((v, i) => (
                <div
                  className={classes.user}
                  key={`participant-${i}`}
                  onClick={() => {
                    setTempList([...tempList, v]);
                  }}
                >
                  <div className={classes.userInfo}>
                    <div className={classes.thumbnail}></div>
                    <div className={classes.userName}>{v.userName}</div>
                  </div>
                  <div className={classes.privileges}></div>
                </div>
              ))}
          </div>
        </div>
        <div className={classes.modalFooter}></div>
      </div>
    </React.Fragment>
  );
}
