import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { rowStyle, sidebarStyle } from "../../styles/layout/sidebar";
import { sidebarData } from "./data";
import {
  RadioButtonUnchecked,
  MenuRounded,
  ArrowDropDownOutlined,
  ArrowDownward,
  ArrowDropDown,
} from "@material-ui/icons";
import clsx from "clsx";
import { IconButton } from "@material-ui/core";

function checkTogglePath(path: string): boolean {
  if (path === "/") return false;
  return true;
}

function checkActive(props: any, route: any) {
  if (route.route === props.url) {
    return true;
  } else {
    if (
      props.subUrl !== undefined &&
      props.subUrl.some((v: any) => v === route.route)
    ) {
      return true;
    }
  }
  return false;
}

function Row(props: {
  data: { url?: string; icon: JSX.Element; title: string; children?: [] };
  toggle: boolean;
}): JSX.Element {
  const classes = rowStyle();
  const route = useRouter();
  const [haveChildren, setHaveChildren] = React.useState(
    props.data.children ? true : false
  );
  const [rowOpen, setRowOpen] = React.useState<boolean>(false);
  let serverCheck = false;

  if (props.data.children !== undefined) {
    props.data.children.map((v) => {
      if (checkActive(v, route)) {
        serverCheck = true;
      }
    });
  }

  return (
    <React.Fragment>
      <a
        className={clsx(
          `${classes.row} ${props.toggle && classes.toggle}`,
          !props.data.children && checkActive(props.data, route)
            ? classes.active
            : classes.unactive
        )}
        href={props.data.url}
        onClick={() => {
          if (haveChildren) {
            setRowOpen(!rowOpen);
          }
        }}
      >
        {props.data.icon}
        {!props.toggle && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span
              className={`${classes.text} ${props.toggle && classes.hidden}`}
            >
              {props.data.title}
            </span>
            {haveChildren && (
              <IconButton style={{ padding: 0, height: "40px", width: "40px" }}>
                <ArrowDropDownOutlined
                  style={{ height: "24px", width: "24px" }}
                  className={classes.collapseButton}
                />
              </IconButton>
            )}
          </div>
        )}
      </a>
      {props.data.children && (
        <div
          className={clsx(
            rowOpen || checkActive(props.data, route)
              ? classes.collapseWrapper
              : classes.unOpenWrapper
          )}
        >
          {props.data.children.map((v: any) => {
            return (
              <a
                key={v.title}
                className={clsx(
                  `${classes.row} ${props.toggle && classes.toggle}`,
                  checkActive(v, route) ? classes.active : classes.unactive
                )}
                href={v.url}
              >
                {v.icon}
                {!props.toggle && (
                  <span
                    className={`${classes.text} ${
                      props.toggle && classes.hidden
                    }`}
                  >
                    {v.title}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      )}
    </React.Fragment>
  );
}

export function Sidebar(props: any) {
  let data: any = sidebarData;
  const classes = sidebarStyle();
  const [toggle, setToggle] = useState<boolean>(false);
  const [userList, setUserList] = React.useState<any[]>([]);
  const router = useRouter();

  const getParticipantList = async () => {
    await fetch(`http://localhost:8000/api/userList`, {
      method: "GET",
      mode: "cors",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 200) {
          setUserList(res.user);
        }
      });
  };

  useEffect(() => {
    getParticipantList();
  }, []);

  useEffect(() => {
    setToggle(checkTogglePath(router.pathname));
  }, [router.pathname]);

  return (
    <div className={classes.sidebarWrapper}>
      <div className={`${classes.sideBar} ${toggle && classes.toggle}`}>
        {Object.keys(data).map((v: string, idx: number) => (
          <Row data={data[v]} toggle={toggle} key={idx} />
        ))}
      </div>
      {!toggle && (
        <div
          style={{
            width: "100%",
            color: "#ffffff",
          }}
        >
          <div
            onClick={() => {}}
            className={classes.test2}
            style={{
              width: "100%",
              height: "30px",
              padding: "8px 15px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "2px",
            }}
          >
            Member
            <span
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => {
                document
                  .getElementById("on-off-content")
                  ?.classList.toggle(classes.onOffContent);
              }}
            >
              <ArrowDropDown />
            </span>
          </div>
          <div
            id="on-off-content"
            style={{
              width: "100%",
              height: "fit-content",
              padding: "8px 15px",
            }}
          >
            {userList.length > 0 &&
              userList.map((v, i) => {
                return (
                  <div
                    key={`user-list-on-off-${i}`}
                    className={classes.test}
                    style={{
                      display: "flex",
                      borderBottom: "1px solid #7d7a7a",
                      margin: "0px -15px",
                      padding: "6px 15px",
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "10px",
                        backgroundColor: "#ffffff",
                        marginRight: "12px",
                        border: `3.5px solid ${
                          props.loginUser?.find(
                            (user: any) => user.userId === v.userId
                          ) !== undefined
                            ? "#42995f"
                            : "#b84343"
                        }`,
                      }}
                    ></div>
                    <div>{v.userName}</div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
      <div
        className={classes.toggleButton}
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        <MenuRounded />
      </div>
    </div>
  );
}
