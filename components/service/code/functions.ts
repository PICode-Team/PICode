import { TTab, TCode, TEditorRoot } from "./types";

export function getExtension(path: string): string {
  const splitedPath = path.split(".");
  return splitedPath.length === 1
    ? "none"
    : splitedPath[splitedPath.length - 1];
}

export function getLanguage(extension: string): string {
  switch (true) {
    case extension === "js":
    case extension === "jsx":
    case extension === "ts":
    case extension === "tsx":
      return "javascript";
    case extension === "py":
      return "python";
    case extension === "cpp":
    case extension === "cc":
    case extension === "c++":
    case extension === "cxx":
    case extension === "hh":
    case extension === "hpp":
    case extension === "h++":
    case extension === "C":
      return "c++";
    case extension === "c":
    case extension === "h":
    case extension === "H":
      return "c";
    case extension === "cs":
    case extension === "csx":
      return "C#";
    case extension === "json":
      return "json";
    case extension === "html":
      return "html";
    case extension === "css":
      return "css";
    default:
      return "default";
  }
}

export function reorderStack(
  OrderStack: number[],
  targetId: number,
  deleted?: boolean
) {
  return OrderStack.reduce(
    (a, c) => {
      if (targetId === c) {
        return a;
      }
      return [...a, c];
    },
    deleted ? [] : [targetId]
  );
}

export function findCurrentFocus(codeOrderStack: number[]): number {
  return codeOrderStack.length === 0 ? -1 : codeOrderStack[0];
}

export function turnOnFocus(codeList: TCode[], targetCodeId: number): TCode[] {
  const editedCodeList = codeList.map((code) => {
    if (targetCodeId === code.codeId) {
      return {
        ...code,
        focus: true,
      };
    }
    return {
      ...code,
      children: turnOnFocus(code.children, targetCodeId),
    };
  });

  return editedCodeList;
}

export function turnOffFocus(codeList: TCode[]): TCode[] {
  const editedCodeList = codeList.map((code) => {
    if (code.focus) {
      return {
        ...code,
        focus: false,
      };
    }
    return {
      ...code,
      children: turnOffFocus(code.children),
    };
  });
  return editedCodeList;
}

export function addTab(
  codeList: TCode[],
  targetCodeId: number,
  addValue: TTab
): TCode[] {
  const addedCodeList = turnOffFocus(codeList).map((code) => {
    if (targetCodeId === code.codeId) {
      return {
        ...code,
        tabList: [...code.tabList, addValue],
        tabOrderStack: [addValue.tabId, ...code.tabOrderStack],
        focus: true,
      };
    }
    return {
      ...code,
      children: addTab(code.children, targetCodeId, addValue),
    };
  });

  return addedCodeList;
}

export function addToDropTab(
  codeList: TCode[],
  targetCodeId: number,
  targetTabId: number,
  addValue: TTab
): TCode[] {
  const editedCodeList = codeList.map((code) => {
    if (targetCodeId === code.codeId) {
      return {
        ...code,
        tabList: code.tabList.reduce((a: TTab[], tab: TTab): TTab[] => {
          if (targetTabId === tab.tabId) {
            return [...a, tab, addValue];
          }
          return [...a, tab];
        }, []),
        tabOrderStack: [addValue.tabId, ...code.tabOrderStack],
      };
    }

    return {
      ...code,
      children: addToDropTab(
        code.children,
        targetCodeId,
        targetTabId,
        addValue
      ),
    };
  });

  return editedCodeList;
}

export function moveTab(
  codeList: TCode[],
  targetCodeId: number,
  selfTabId: number,
  targetTabId: number
): TCode[] {
  const editedCodeList = codeList.map((code) => {
    if (targetCodeId === code.codeId) {
      const selfTab = code.tabList.find((tab) => selfTabId === tab.tabId);

      if (selfTab === undefined) {
        return {
          ...code,
          children: moveTab(
            code.children,
            targetCodeId,
            selfTabId,
            targetTabId
          ),
        };
      }

      const selfTabPosition = code.tabList.map((tab: TTab, i: number) => {
        if (selfTabId === tab.tabId) return i;
      });

      const targetTabPosition = code.tabList.map((tab: TTab, i: number) => {
        if (targetTabId === tab.tabId) return i;
      });

      const checkPosition = selfTabPosition > targetTabPosition;

      return {
        ...code,
        tabList: code.tabList.reduce((a: TTab[], tab: TTab): TTab[] => {
          if (selfTabId === tab.tabId) return a;

          if (targetTabId === tab.tabId)
            return !checkPosition ? [...a, selfTab, tab] : [...a, tab, selfTab];

          return [...a, tab];
        }, []),
        tabOrderStack: reorderStack(code.tabOrderStack, selfTabId),
      };
    }

    return {
      ...code,
      children: moveTab(code.children, targetCodeId, selfTabId, targetTabId),
    };
  });

  return editedCodeList;
}

export function updateTab(
  codeList: TCode[],
  targetCodeId: number,
  targetTabId: number,
  changeValue: TTab
): TCode[] {
  // const updatedCodeList;
  return [];
}

export function deleteTab(codeList: TCode[], targetTabId: number): TCode[] {
  const deletedCodeList = codeList.map((code) => {
    return {
      ...code,
      tabList: code.tabList.filter((tab) => targetTabId !== tab.tabId),
      children: deleteTab(code.children, targetTabId),
    };
  });

  return reorderTab(deletedCodeList, targetTabId, true);
}

export function reorderTab(
  codeList: TCode[],
  targetTabId: number,
  deleted?: boolean
): TCode[] {
  const reorderedCodeList = codeList.map((code) => {
    if (code.tabOrderStack.includes(targetTabId)) {
      return {
        ...code,
        tabOrderStack: reorderStack(code.tabOrderStack, targetTabId, deleted),
      };
    }

    return {
      ...code,
      children: reorderTab(code.children, targetTabId, deleted),
    };
  });

  return reorderedCodeList;
}

export function reorderTabList(codeList: TCode[], targetCodeId: number) {
  //
}

export function checkTabDuplicating(
  codeList: TCode[],
  targetCodeId: number,
  targetPath: string
): boolean {
  const isDuplicate = codeList.some((code) => {
    if (targetCodeId === code.codeId) {
      const check = code.tabList.some((tab) => {
        if (tab.path === targetPath) {
          return true;
        }
      });
      if (check) return true;
    }
    return checkTabDuplicating(code.children, targetCodeId, targetPath);
  });

  return isDuplicate;
}

export function updateCode() {
  //
}

export function addCode(
  codeList: TCode[],
  targetCodeId: number,
  addValue: TCode,
  vertical: boolean,
  left: boolean
): TCode[] {
  if (targetCodeId === -1) {
    return [addValue, ...codeList];
  }

  const addedCodeList = turnOffFocus(codeList).reduce(
    (a: TCode[], code: TCode): TCode[] => {
      if (targetCodeId === code.codeId) {
        if (vertical !== code.vertical) {
          if (left) {
            return [...a, addValue, code];
          } else {
            return [...a, code, addValue];
          }
        } else {
          if (left) {
            return [
              ...a,
              {
                ...code,
                children: [addValue, ...code.children],
              },
            ];
          } else {
            return [
              ...a,
              {
                ...code,
                children: [...code.children, addValue],
              },
            ];
          }
        }
      }
      return [
        ...a,
        {
          ...code,
          children: addCode(
            code.children,
            targetCodeId,
            addValue,
            vertical,
            left
          ),
        },
      ];
    },
    []
  );

  return addedCodeList;
}

/// ... T_T
export function deleteCode(codeList: TCode[], targetCodeId: number): TCode[] {
  const deletedCodeList = codeList.reduce((a: TCode[], code: TCode) => {
    if (targetCodeId === code.codeId) {
      if (code.children.length === 0) {
        return a;
      } else {
        return [
          ...a,
          {
            children: code.children.filter(
              (child) => code.children[0].codeId !== child.codeId
            ),
            codeId: code.children[0].codeId,
            focus: true,
            tabList: code.children[0].tabList,
            tabOrderStack: code.children[0].tabOrderStack,
            vertical: !code.children[0].vertical,
          },
        ];
      }
    }

    return [
      ...a,
      {
        ...code,
        children: deleteCode(code.children, targetCodeId),
      },
    ];
  }, []);

  return deletedCodeList;
}

export function findEmptyCode(codeList: TCode[]): any {
  for (let i = 0; i < codeList.length; i++) {
    if (codeList[i].tabList.length === 0) {
      return codeList[i].codeId;
    } else {
      const value = findEmptyCode(codeList[i].children);
      if (typeof value === "number") return value;
    }
  }
}

export function findTabByPathInCode(
  codeList: TCode[],
  targetCodeId: number,
  targetPath: string
): any {
  for (let i = 0; i < codeList.length; i++) {
    if (targetCodeId === codeList[i].codeId) {
      for (let i2 = 0; i2 < codeList[i].tabList.length; i2++) {
        if (targetPath === codeList[i].tabList[i2].path)
          return codeList[i].tabList[i2].tabId;
      }
    }
    const value = findTabByPathInCode(
      codeList[i].children,
      targetCodeId,
      targetPath
    );
    if (value !== -1) return value;
  }

  return -1;
}

export function setTabInCode(
  codeList: TCode[],
  codeId: number,
  tabId: number,
  content: string
) {}

export function getTabInCode(
  codeList: TCode[],
  codeId: number
): TTab | undefined {
  for (let i = 0; i < codeList.length; i++) {
    if (codeList[i].codeId === codeId) {
      return codeList[i].tabList.find(
        (tab) => tab.tabId === codeList[i].tabOrderStack[0]
      );
    }

    const value = getTabInCode(codeList[i].children, codeId);
    if (value !== undefined) return value;
  }
}

interface TFile {
  path: string;
  children?: TFile[] | undefined;
}

export function getFileInfo(
  fileStructure: TFile,
  targetPath: string
): TFile | undefined {
  if (fileStructure.path === targetPath) return fileStructure;

  if (fileStructure.children) {
    for (let i = 0; i < fileStructure.children.length; i++) {
      const value = getFileInfo(fileStructure.children[i], targetPath);
      if (value !== undefined) return value;
    }
  }
}

export function reorderFileStructure(fileStructure: TFile): TFile {
  const newChildren: TFile[] | undefined = (() => {
    if (fileStructure.children !== undefined) {
      const dirList: TFile[] = [];
      const fileList: TFile[] = [];

      fileStructure.children.forEach((v, i) => {
        if (v.children !== undefined)
          dirList.push({ ...v, children: reorderFileStructure(v).children });
        else fileList.push(v);
      });
      return [...dirList, ...fileList];
    }
    return undefined;
  })();

  return {
    path: fileStructure.path,
    children: newChildren,
  };
}

export function addCreateInput(
  fileStructure: TFile,
  targetPath: string,
  isDirectory: boolean
): TFile {
  const newChildren: TFile[] | undefined = (() => {
    if (fileStructure.children !== undefined) {
      if (targetPath === fileStructure.path) {
        if (isDirectory) {
          return [{ path: "///create:directory" }, ...fileStructure.children];
        } else {
          const dirList: TFile[] = [];
          const fileList: TFile[] = [];

          fileStructure.children.forEach((v, i) => {
            if (v.children !== undefined) dirList.push(v);
            else fileList.push(v);
          });

          return [...dirList, { path: "///create:file" }, ...fileList];
        }
      }
      return fileStructure.children.map((v, i) =>
        addCreateInput(v, targetPath, isDirectory)
      );
    }
    return undefined;
  })();

  return {
    path: fileStructure.path,
    children: newChildren,
  };
}

export function deleteCreateInput(fileStructure: TFile): TFile {
  const newChildren: TFile[] | undefined = (() => {
    if (fileStructure.children !== undefined) {
      return fileStructure.children.reduce((a: TFile[], c: TFile): TFile[] => {
        if (c.path.includes("///create:")) {
          return a;
        }
        return [...a, deleteCreateInput(c)];
      }, []);
    }
    return undefined;
  })();

  return {
    path: fileStructure.path,
    children: newChildren,
  };
}

export function checkSamePath(
  fileStructure: TFile,
  targetPath: string
): boolean {
  if (targetPath === fileStructure.path) return true;
  let check = false;

  if (fileStructure.children !== undefined) {
    check = fileStructure.children.some((v, i) => {
      return checkSamePath(v, targetPath);
    });
  }

  return check;
}

export function addRenameField(fileStructure: TFile, targetPath: string) {
  const newChildren: TFile[] | undefined = (() => {
    if (fileStructure.children !== undefined) {
      return fileStructure.children.reduce((a: TFile[], c: TFile): TFile[] => {
        if (c.path === targetPath) {
          return [
            ...a,
            {
              path:
                c.children !== undefined
                  ? "///create:directory"
                  : "///create:file",
            },
          ];
        }
        return [...a, addRenameField(c, targetPath)];
      }, []);
    }
    return undefined;
  })();

  return {
    path: fileStructure.path,
    children: newChildren,
  };
}

export function pasteFile() {}

export function insertCodeContent(
  codeList: TCode[],
  targetPath: string,
  content: string
): TCode[] {
  return codeList.map((code) => {
    return {
      ...code,
      tabList: code.tabList.map((tab) => {
        if (tab.path === targetPath) {
          return { ...tab, content: content };
        }
        return tab;
      }),
      children: insertCodeContent(code.children, targetPath, content),
    };
  });
}
