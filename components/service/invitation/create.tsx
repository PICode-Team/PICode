import React, { useState } from "react";
import { createStyle } from "../../../styles/service/invitation/create";
import CustomTextField from "../../items/input/textfield";
import CustomButton from "../../items/input/button";
import { Close, Link } from "@material-ui/icons/";

const projectName = "projectName";

export function Create() {
  const classes = createStyle();
  const [modal, setModal] = useState<boolean>(true);
  const [tooltip, setTooltip] = useState<boolean>(false);

  return (
    <React.Fragment>
      <div
        className={`${classes.overlay} ${!modal && classes.visibility}`}
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          event.preventDefault();

          setModal(false);
        }}
      />
      <div className={`${classes.modal} ${!modal && classes.visibility}`}>
        <div className={classes.modalHeader}>
          <span>Invite people to {projectName}</span>
          <div
            onClick={(event: React.MouseEvent<HTMLElement>) => {
              setModal(false);
            }}
          >
            <Close />
          </div>
        </div>
        <div className={classes.modalBody}>
          <CustomTextField label="Name" />
        </div>
        <div className={classes.modalFooter}>
          <div
            className={classes.copyLink}
            onClick={() => {
              setTooltip(true);
              setTimeout(() => {
                setTooltip(false);
              }, 500);
            }}
          >
            <Link />
            <span>Copy invite link</span>
            <span
              className={`${classes.tooltipText} ${tooltip && classes.active}`}
            >
              Link copied!
            </span>
          </div>
          <CustomButton text="SEND" width="76px" />
        </div>
      </div>
    </React.Fragment>
  );
}
