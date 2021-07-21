import { AddCircleRounded, ArrowForwardIos } from "@material-ui/icons";
import { path } from "d3";
import React from "react";
import { useCode } from "../../../../hooks/code";
import { useDrag } from "../../../../hooks/drag";
import { sidebarStyle } from "../../../../styles/service/code/code";
import {
  addCode,
  addTab,
  checkTabDuplicating,
  findCurrentFocus,
  findTabByPathInCode,
  getExtension,
  getLanguage,
  reorderTab,
} from "../functions";

interface TFile {
  name: string;
  path: string;
  open: boolean;
  children?: TFile[] | undefined;
}

const dummy: TFile = {
  name: "string",
  path: "string",
  open: true,
  children: [
    {
      name: "string",

      path: "string1",
      open: true,
      children: [
        {
          name: "string",

          path: "string2",
          open: true,
          children: [
            {
              name: "string",

              path: "string3",
              open: true,
              children: [
                {
                  name: "string",

                  path: "string4",
                  open: false,
                },
                {
                  name: "string",

                  path: "string5",
                  open: false,
                },
                {
                  name: "string",

                  path: "string6",
                  open: false,
                },
                {
                  name: "string",

                  path: "string7",
                  open: false,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

function makeFileStructure(
  { name, path, open, children }: TFile,
  depth: number
) {
  const classes = sidebarStyle();
  const { code, setCode } = useCode();
  const { setDragInfo, deleteDragInfo } = useDrag();

  function handleDirectoryToggle(event: React.MouseEvent<HTMLElement>) {
    (event.currentTarget.parentNode! as HTMLElement).classList.toggle(
      classes.close
    );
  }

  function handleClickFile(event: React.MouseEvent<HTMLElement>) {
    let addCodeCheck = false;
    let addTabCheck = true;
    const newRoot = (() => {
      if (code.codeOrderStack.length === 0) {
        addCodeCheck = true;
        return addCode(
          code.root,
          -1,
          {
            tabList: [
              {
                path: path,
                extension: getExtension(path),
                langauge: getLanguage(getExtension(path)),
                tabId: code.tabCount,
              },
            ],
            children: [],
            tabOrderStack: [code.tabCount],
            codeId: code.codeCount,
            vertical: false,
            focus: true,
          },
          true,
          false
        );
      }

      if (
        checkTabDuplicating(
          code.root,
          findCurrentFocus(code.codeOrderStack),
          path
        )
      ) {
        addTabCheck = false;
        const tabId = findTabByPathInCode(
          code.root,
          findCurrentFocus(code.codeOrderStack),
          path
        );
        return reorderTab(code.root, tabId);
      } else {
        return addTab(code.root, code.codeOrderStack[0], {
          path: path,
          extension: getExtension(path),
          langauge: getLanguage(getExtension(path)),
          tabId: code.tabCount,
        });
      }
    })();

    setCode({
      ...code,
      root: newRoot,
      tabCount: addTabCheck ? code.tabCount + 1 : code.tabCount,
      codeCount: addCodeCheck ? code.codeCount + 1 : code.codeCount,
      codeOrderStack: addCodeCheck
        ? [code.codeCount, ...code.codeOrderStack]
        : code.codeOrderStack,
    });
  }

  function handleDragFile(event: React.DragEvent<HTMLDivElement>) {
    //
  }

  function handleDragStartFile(event: React.DragEvent<HTMLDivElement>) {
    // store drag info
    setDragInfo({ path: path, tabId: -1 });
  }

  function handleDragEndFile(event: React.DragEvent<HTMLDivElement>) {
    // delete drag info
    deleteDragInfo();
  }

  function handleDragEnterFile(event: React.DragEvent<HTMLDivElement>) {
    // To be filling in later
  }

  function handleDragLeaveFile(event: React.DragEvent<HTMLDivElement>) {
    // To be filling in later
  }

  function handleDropFile(event: React.DragEvent<HTMLDivElement>) {
    // To be filling in later
  }

  if (children !== undefined) {
    return (
      <div className={classes.depth} key={path}>
        <div
          className={`${classes.file}`}
          style={{ paddingLeft: `${depth * 6 + 6}px` }}
          onClick={handleDirectoryToggle}
        >
          <ArrowForwardIos />
          {name}
        </div>
        <div className={classes.group}>
          {children?.map((v, i) => makeFileStructure(v, depth + 1))}
        </div>
      </div>
    );
  }

  return (
    <div
      key={path}
      className={classes.file}
      style={{ paddingLeft: `${depth * 6 + 6}px` }}
      onClick={handleClickFile}
      draggable={true}
      onDrag={handleDragFile}
      onDragStart={handleDragStartFile}
      onDragEnd={handleDragEndFile}
      onDragEnter={handleDragEnterFile}
      onDragLeave={handleDragLeaveFile}
      onDrop={handleDropFile}
    >
      <span></span>
      {name}
    </div>
  );
}

export function Sidebar(): JSX.Element {
  const classes = sidebarStyle();
  const projectName = "test";

  return (
    <div className={classes.sidebar}>
      <div className={classes.rootDirectory}>
        <ArrowForwardIos />
        {projectName}
      </div>
      <div className={classes.fileWrapper}>{makeFileStructure(dummy, 1)}</div>
    </div>
  );
}
