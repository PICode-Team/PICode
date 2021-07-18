export interface TTab {
  path: string;
  extension: string;
  langauge: string;
  tabId: number;
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
