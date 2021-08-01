export interface TTab {
  path: string;
  extension: string;
  langauge: string;
  tabId: number;
  content: string;
}

export interface TCode {
  tabList: TTab[];
  children: TCode[];
  tabOrderStack: number[];
  codeId: number;
  vertical: boolean;
  focus: boolean;
}

export interface TEditorRoot {
  codeOrderStack: number[];
  root: TCode[];
  vertical: boolean;
  tabCount: number;
  codeCount: number;
}

// ---------------------

// export interface TTab {
//   path: string;
//   tabId: number;
// }
//
// export interface TCode {
//   children: TCode[];
//   tabOrderStack: number[];
//   codeId: number;
//   focus: boolean;
// }
//
// export interface TEditorRoot {
//   codeOrderStack: number[];
//   root: TCode[];
//   vertical: boolean;
//   tabCount: number;
//   codeCount: number;
//   tabInfoList: { key: number; tab: TTab };
// }

// orderStack만 가지고 전체는 루트에 다 저장하는 방식으로 다시

// 어떤 프로젝트, 어떤 파일을, 어떤 사용자가

//
