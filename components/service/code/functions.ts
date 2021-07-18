import { TTab, TCode, TEditorRoot } from "./types";

export function getExtension(path: string): string {
  const splitedPath = path.split(".");
  return splitedPath.length === 1
    ? "none"
    : splitedPath[splitedPath.length - 1];
}

export function getLanguage(extension: string): string {
  switch (true) {
    case extension === "js" ||
      extension === "jsx" ||
      extension === "ts" ||
      extension === "tsx":
      return "javascript";
    case extension === "py":
      return "python";
    case extension === "cpp":
      return "c++";
    case extension === "c":
      return "c";
    case extension === "json":
      return "json ";
    default:
      return "default";
  }
}

export function reorderStack(
  OrderStack: number[],
  targetId: number,
  deleted?: boolean
): number[] {
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

export function findCurrentFocus(root: TEditorRoot): number {
  return root.codeOrderStack[0];
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

export function updateRoot(
  currentRoot: TEditorRoot,
  {
    tabOrderStack,
    root,
    vertical,
    tabCount,
    codeCount,
  }: {
    tabOrderStack?: number[];
    root?: TCode[];
    vertical?: boolean;
    tabCount?: number;
    codeCount?: number;
  }
) {
  return {
    tabOrderStack: tabOrderStack ?? currentRoot.codeOrderStack,
    root: root ?? currentRoot.root,
    vertical: vertical ?? currentRoot.vertical,
    tabCount: tabCount ?? currentRoot.tabCount,
    codeCount: codeCount ?? currentRoot.codeCount,
  };
}

// focus review required (Maybe I don't need it.)
export function updateTab(
  codeList: TCode[],
  targetTabId: number,
  changeValue: TTab
): TCode[] {
  const updatedCodeList = codeList.map((code) => {
    return {
      ...code,
      tabList: code.tabList.reduce((a: TTab[], tab: TTab) => {
        if (targetTabId === tab.tabId) return [...a, changeValue];
        return [...a, tab];
      }, []),
      children: deleteTab(code.children, targetTabId),
    };
  });

  return updatedCodeList;
}

// add code to give focus again
// if tabList.length === 0
// delete code
export function deleteTab(codeList: TCode[], targetTabId: number): TCode[] {
  const deletedCodeList = codeList.map((code) => {
    return {
      ...code,
      tabList: code.tabList.filter((tab) => targetTabId !== tab.tabId),
      children: deleteTab(code.children, targetTabId),
      focus:
        code.tabOrderStack.includes(targetTabId) && code.tabList.length === 1
          ? false
          : code.focus,
    };
  });

  return reorderTab(deletedCodeList, targetTabId, true);
}

// requires regeneration after focus deletion
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

export function tabDuplicateCheck(codeList: TCode[], targetPath: string) {
  const isDuplicate = codeList.some((code) => {
    const result = code.tabList.some((tab) => {
      if (tab.path === targetPath) return true;
    });

    if (result) return result;

    tabDuplicateCheck(code.children, targetPath);
  });

  return isDuplicate;
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

export function updateCode(
  codeList: TCode[],
  targetCodeId: number,
  changeValue: TCode
): TCode[] {
  const updatedCodeList = codeList.map((code) => {
    if (targetCodeId === code.codeId) return changeValue;
    return {
      ...code,
      children: updateCode(code.children, targetCodeId, changeValue),
    };
  });

  return updatedCodeList;
}

export function deleteCode(codeList: TCode[], targetCodeId: number): TCode[] {
  const deletedCodeList = codeList.reduce((a: TCode[], code: TCode) => {
    if (targetCodeId === code.codeId) return a;
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

export function addCode(
  codeList: TCode[],
  targetCodeId: number,
  addValue: TCode,
  vertical: boolean
): TCode[] {
  if (targetCodeId === -1) {
    return [addValue, ...codeList];
  }

  const addedCodeList = codeList.reduce((a: TCode[], code: TCode) => {
    if (targetCodeId === code.codeId) {
      if (vertical === code.vertical) {
        return [...a, code, addValue];
      } else {
        return [...a, { ...code, children: [...code.children, addValue] }];
      }
    }
    return [
      ...a,
      {
        ...code,
        children: addCode(code.children, targetCodeId, addValue, vertical),
      },
    ];
  }, []);

  return addedCodeList;
}

export function findTabByPath(codeList: TCode[], targetPath: string): number {
  let tabId = -1;

  codeList.forEach((code) => {
    code.tabList.forEach((tab) => {
      if (targetPath === tab.path) {
        tabId = tab.tabId;
      }
    });
  });

  return tabId;
}

export function findCodeByPath(codeList: TCode[], targetPath: string): number {
  let codeId = -1;
  codeList.some((code) => {
    const isTargetTab = code.tabList.some((tab) => {
      if (tab.path === targetPath) return true;
    });
    if (isTargetTab) codeId = code.codeId;
  });

  return codeId;
}

export function findEmptyCode(codeList: TCode[]): number {
  let emptyCodeId = -1;

  codeList.some((code) => {
    if (code.tabList.length === 0) {
      emptyCodeId = code.codeId;
      return true;
    }

    findEmptyCode(code.children);
  });

  return emptyCodeId;
}

// ===========================================================

export function splitCode() {}

// ===========================================================
