import React, { useEffect, useState } from "react";
import { UserInfoStyle } from "../../../styles/layout/item/tooltip";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import { IconButton } from "@material-ui/core";
import CustomButton from "../../items/input/button";
import { Edit } from "@material-ui/icons";

export default function UserInfo(props: any) {
  const classes = UserInfoStyle();

  return (
    <div className={classes.userInfo}>
      <div className={classes.topbar}>
        <IconButton
          style={{ color: props.theme === "dark" ? "#fff" : "#121212" }}
          onClick={() => props.setOpen(false)}
        >
          <ClearRoundedIcon />
        </IconButton>
      </div>
      <div className={classes.content}>
        <div
          style={{
            width: "50%",
            height: "50%",
            backgroundColor: "#ffffff",
            borderRadius: "50%",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "",
            backgroundImage: `url('http://localhost:8000/api/temp/${props.data.userThumbnail}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#4078b8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "16px",
              cursor: "pointer",
            }}
            onClick={() => {}}
          >
            <Edit
              style={{
                width: "20px",
                height: "20px",
                color: "#ffffff",
              }}
            />
          </div>
          {props.data.userThumbnail === undefined && (
            <div
              style={{
                width: "100%",
                height: "calc(50% - 32px)",
                fontSize: "52px",
                fontWeight: "bold",
                marginTop: "-8px",
              }}
            >
              {props.data.userName.slice(0, 1)}
            </div>
          )}
        </div>
        <div className={classes.contentText}>Hello, {props.data.userName}</div>
        <div style={{ color: "#ffffff" }}>You had to {4} issues in 7 days</div>
        <button
          className={classes.logout}
          style={{ marginTop: "22px" }}
          onClick={async () => {
            let data = await fetch(`http://localhost:8000/api/user/sign`, {
              method: "DELETE",
              mode: "cors",
              credentials: "same-origin",
              headers: {
                "Content-Type": "application/json",
              },
            });
            window.location.reload();
          }}
        >
          logout
        </button>
      </div>
    </div>
  );
}
