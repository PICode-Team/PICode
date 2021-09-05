/* eslint-disable react-hooks/exhaustive-deps */
import { Search } from "@material-ui/icons";
import clsx from "clsx";
import { useRouter } from "next/router";
import React from "react";
import { manageStyle } from "../../../styles/service/manage";
import Board from "./board";
import MakeKanban from "./create/makeboard";
import MakeMile from "./create/makemile";
import Milestone from "./milestone";

export default function Manage(ctx: any) {
  const classes = manageStyle();
  const router = useRouter();
  const manageMenu = ["Board", "Milestone"];
  const [menu, setMenu] = React.useState<string>("Board");
  const [create, setCreate] = React.useState<boolean>(false);
  const [kanban, setKanban] = React.useState<any[]>();
  const [milestone, setMilestone] = React.useState<any>();
  const [open, setOpen] = React.useState(false);

  const makeContent = () => {
    switch (menu) {
      case "Board":
        return (
          <Board
            ctx={ctx}
            setCreate={setCreate}
            kanban={kanban}
            open={open}
            setOpen={setOpen}
          />
        );
      default:
        return (
          <Milestone
            ctx={ctx}
            setCreate={setCreate}
            milestone={milestone}
            open={open}
            setOpen={setOpen}
          />
        );
    }
  };

  React.useEffect(() => {
    if (ctx.ws.current) {
      ctx.ws.current.addEventListener("message", (msg: any) => {
        let content = JSON.parse(msg.data);
        if (content.category === "kanban") {
          switch (content.type) {
            case "getKanban":
              setKanban(content.data.kanbans);
              break;
            default:
          }
        } else if (content.category === "milestone") {
          switch (content.type) {
            case "getMilestone":
              setMilestone(content.data);
              break;
            default:
          }
        }
      });

      ctx.ws.current.send(
        JSON.stringify({
          category: "kanban",
          type: "getKanban",
          data: {},
        })
      );

      ctx.ws.current.send(
        JSON.stringify({
          category: "milestone",
          type: "getMilestone",
          data: {},
        })
      );
    }
  }, [ctx.ws]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div className={classes.title}>
        <div className={classes.search}>
          <Search />
          <input type="text" placeholder="Search User or Channel" />
        </div>
        <div
          className={classes.button}
          onClick={() => {
            setOpen(true);
          }}
        >
          Create
        </div>
      </div>
      <div className={classes.content}>
        <div className={classes.projectContent}>
          <div className={classes.projectHeader}>
            {manageMenu.map((v: string) => {
              return (
                <div
                  className={clsx(
                    classes.headerMenu,
                    v === menu && classes.makeLine,
                    v !== menu && classes.notSelect
                  )}
                  onClick={() => {
                    setMenu(v);
                  }}
                  key={v}
                >
                  {v}
                </div>
              );
            })}
          </div>
          <div className={classes.manageContent}>{makeContent()}</div>
        </div>
      </div>
      {menu === "Board" ? (
        <MakeKanban
          userId={ctx.session.userId}
          open={open}
          setOpen={setOpen}
          ws={ctx.ws.current}
        />
      ) : (
        <MakeMile open={open} setOpen={setOpen} ws={ctx.ws.current} />
      )}
    </div>
  );
}
