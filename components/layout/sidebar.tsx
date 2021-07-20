import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { rowStyle, sidebarStyle } from "../../styles/layout/sidebar";
import { sidebarData } from "./data";
import { RadioButtonUnchecked, MenuRounded } from "@material-ui/icons";

function checkTogglePath(path: string): boolean {
  if (path === "/") return false;
  return true;
}

function Row(props: {
  data: { url: string; icon: string; title: string };
  toggle: boolean;
}): JSX.Element {
  const classes = rowStyle();

  return (
    <a
      className={`${classes.row} ${props.toggle && classes.toggle}`}
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
    </div>
  );
}
