import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { rowStyle, sidebarStyle } from "../../styles/layout/sidebar";
import { sidebarData } from "./data";
import { RadioButtonUnchecked, MenuRounded } from "@material-ui/icons";
import clsx from "clsx";


function checkTogglePath(path: string): boolean {
  if (path === "/") return false;
  return true;
}

function checkActive(props: any, route: any) {
  if (route.route === props.data.url) {
    return true;
  }
  else {
    if (props.data.subUrl !== undefined && props.data.subUrl.some((v: any) => v === route.route)) {
      return true
    }
  }
  return false;
}

function Row(props: {
  data: { url: string; icon: JSX.Element; title: string };
  toggle: boolean;
}): JSX.Element {
  const classes = rowStyle();
  const route = useRouter();

  return (
    <a
      className={clsx(`${classes.row} ${props.toggle && classes.toggle}`, checkActive(props, route) ? classes.active : classes.unactive)}
      href={props.data.url}
    >
      {props.data.icon}
      <span className={`${classes.text} ${props.toggle && classes.hidden}`}>
        {props.data.title}
      </span>
    </a>
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
