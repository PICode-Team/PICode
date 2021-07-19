import { AddCircleRounded, ArrowForwardIos } from "@material-ui/icons";
import { path } from "d3";
import React from "react";
import { useCode } from "../../../../hooks/code";
import { useDrag } from "../../../../hooks/drag";
import { sidebarStyle } from "../../../../styles/service/code/code";
import {
  addCode,
  addTab,
  findTabByPath,
  getExtension,
  getLanguage,
  reorderTab,
  tabDuplicateCheck,
} from "../functions";

interface TFile {
  name: string;
  isDirectory: boolean;
  path: string;
  open: boolean;
  children?: TFile[];
}

const dummy: TFile = {
  name: "string",
  isDirectory: true,
  path: "string",
  open: true,
  children: [
    {
      name: "string",
      isDirectory: true,
      path: "string1",
      open: true,
      children: [
        {
          name: "string",
          isDirectory: true,
          path: "string2",
          open: true,
          children: [
            {
              name: "string",
              isDirectory: true,
              path: "string3",
              open: true,
              children: [
                {
                  name: "string",
                  isDirectory: false,
                  children: [],
                  path: "string4",
                  open: false,
                },
                {
                  name: "string",
                  isDirectory: false,
                  children: [],
                  path: "string5",
                  open: false,
                },
                {
                  name: "string",
                  isDirectory: false,
                  children: [],
                  path: "string6",
                  open: false,
                },
                {
                  name: "string",
                  isDirectory: false,
                  children: [],
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

function makeFileStructure(file: TFile, depth: number) {
  const classes = sidebarStyle();
  const { code, setCode } = useCode();
  const { setDragInfo } = useDrag();

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
                path: file.path,
                extension: getExtension(file.path),
                langauge: getLanguage(getExtension(file.path)),
                tabId: code.tabCount,
              },
            ],
            children: [],
            tabOrderStack: [code.tabCount],
            codeId: code.codeCount,
            vertical: false,
            focus: true,
          },
          false
        );
      }

      if (tabDuplicateCheck(code.root, file.path)) {
        addTabCheck = false;
        const tabId = findTabByPath(code.root, file.path);
        return reorderTab(code.root, tabId);
      } else {
        return addTab(code.root, code.codeOrderStack[0], {
          path: file.path,
          extension: getExtension(file.path),
          langauge: getLanguage(getExtension(file.path)),
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
    event.preventDefault();

    setDragInfo({
      path: file.path,
      tabId: -1,
    });
  }

  function handleDragStartFile(event: React.DragEvent<HTMLDivElement>) {}

  if (file.isDirectory) {
    return (
      <div className={classes.depth} key={file.path}>
        <div
          className={`${classes.file}`}
          style={{ paddingLeft: `${depth * 6 + 6}px` }}
          onClick={handleDirectoryToggle}
        >
          <ArrowForwardIos />
          {file.name}
        </div>
        <div className={classes.group}>
          {file.children?.map((v, i) => makeFileStructure(v, depth + 1))}
        </div>
      </div>
    );
  }

  return (
    <div
      key={file.path}
      className={classes.file}
      style={{ paddingLeft: `${depth * 6 + 6}px` }}
      onClick={handleClickFile}
      draggable={true}
      onDrag={handleDragFile}
      onDragStart={handleDragStartFile}
    >
      <span>
        <AddCircleRounded />
      </span>
      {file.name}
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
