import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { rowStyle, sidebarStyle } from "../../styles/layout/sidebar";
import { sidebarData } from "./data";
import { RadioButtonUnchecked, MenuRounded, ArrowDropDownOutlined } from "@material-ui/icons";
import clsx from "clsx";
import { IconButton } from "@material-ui/core";


function checkTogglePath(path: string): boolean {
  if (path === "/") return false;
  return true;
}

function checkActive(props: any, route: any) {
  if (route.route === props.url) {
    return true;
  }
  else {
    if (props.subUrl !== undefined && props.subUrl.some((v: any) => v === route.route)) {
      return true
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
  const [haveChildren, setHaveChildren] = React.useState(props.data.children ? true : false);
  const [rowOpen, setRowOpen] = React.useState<boolean>(false);
  let serverCheck = false;

  if (props.data.children !== undefined) {
    props.data.children.map((v) => {
      if (checkActive(v, route)) {
        serverCheck = true
      }
    })
  }

  return (
    <React.Fragment>
      <a
        className={clsx(`${classes.row} ${props.toggle && classes.toggle}`, (!props.data.children && checkActive(props.data, route)) ? classes.active : classes.unactive)}
        href={props.data.url}
        onClick={() => {
          if (haveChildren) {
            setRowOpen(!rowOpen)
          }
        }}
      >
        {props.data.icon}
        {!props.toggle && <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span className={`${classes.text} ${props.toggle && classes.hidden}`}>
            {props.data.title}
          </span>
          {haveChildren && <IconButton style={{ padding: 0, height: "40px", width: "40px" }}>
            <ArrowDropDownOutlined
              style={{ height: "24px", width: "24px" }} className={classes.collapseButton} />
          </IconButton>}
        </div>}
      </a>
      {props.data.children && <div className={clsx((rowOpen || checkActive(props.data, route)) ? classes.collapseWrapper : classes.unOpenWrapper)}>
        {props.data.children.map((v: any) => {
          return <a
            key={v.title}
            className={clsx(`${classes.row} ${props.toggle && classes.toggle}`, checkActive(v, route) ? classes.active : classes.unactive)}
            href={v.url}
          >
            {v.icon}
            {!props.toggle && <span className={`${classes.text} ${props.toggle && classes.hidden}`}>
              {v.title}
            </span>}
          </a>
        })}
      </div>}
    </React.Fragment>
  );
}

export function Sidebar() {
  let data: any = sidebarData;
  const classes = sidebarStyle();
  const [toggle, setToggle] = useState<boolean>(false);
  const router = useRouter();

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
      <div
        className={classes.toggleButton}
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        <MenuRounded />
      </div>
    </div >
  );
}
