import { RadioButtonUnchecked } from "@material-ui/icons";
import React from "react";
import { confirmStyle } from "../../../styles/service/invitation/confirm";
import CustomButton from "../../items/input/button";

export function Confirm() {
  const classes = confirmStyle();

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <div className={classes.header}>
          <div className={classes.title}>
            <RadioButtonUnchecked />
            <span>PICODE</span>
          </div>
          <div className={classes.headerContent}>
            <div>Join your project on picode</div>
            <div>user1 has invited you to use picode with them</div>
            <div>
              in a project called <span>projectName</span>
            </div>
          </div>
        </div>
        <div className={classes.body}>
          <div className={classes.bodyContent}>
            <div className={classes.userText}>
              김진구 and 5 others have already joined
            </div>
            <div className={classes.userWrapper}>
              <div
                className={classes.user}
                style={{ backgroundColor: "#1E9CD1" }}
              ></div>
              <div
                className={classes.user}
                style={{ backgroundColor: "#8C309A" }}
              ></div>
              <div
                className={classes.user}
                style={{ backgroundColor: "#2AAD78" }}
              ></div>

              <div
                className={classes.user}
                style={{ backgroundColor: "#8C309A" }}
              ></div>
              <div
                className={classes.user}
                style={{ backgroundColor: "#0BD4C2" }}
              ></div>
            </div>
          </div>
        </div>
        <div className={classes.footer}>
          <div className={classes.description}>
            <div className={classes.descriptionTitle}>What is Slack?</div>
            <div className={classes.descriptionContent}>
              Slack is a messaging app for teams, a place you can collaborate on
              projects and organize conversations — so you can work together, no
              matter where you are. Learn more about Slack
            </div>
          </div>
          <CustomButton text="JOIN" width="76px" />
        </div>
      </div>
    </div>
  );
}
