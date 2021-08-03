import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const codeStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    root: {
      backgroundColor: theme.backgroundColor.step0,
      width: "calc(100% - 64px)",
      height: "100%",
      display: "flex",
    },
    content: {
      width: "calc(100% - 300px)",
      height: "100%",
      color: theme.font.high.color,
    },
    row: {
      width: "100%",
      height: "100%",
      overflow: "hidden",
      display: "flex",
    },
    column: {
      width: "100%",
      height: "100%",
      backgroundColor: theme.backgroundColor.step3,
      display: "flex",
      flexDirection: "column",
    },
    emptyCode: {
      width: "100%",
      height: "100%",
      color: theme.font.high.color,
      fontSize: theme.font.high.size,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.backgroundColor.step0,
    },
    drag: {
      backgroundColor: theme.editor.drag.emptyCode,
    },
    wrapperDrag: {
      "& *": {
        pointerEvents: "none",
      },
    },
  })
);

export const fileStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    file: {},
  })
);

export const directoryStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    directory: {},
  })
);

export const sidebarStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    sidebar: {
      width: "300px",
      height: "100%",
      backgroundColor: theme.backgroundColor.step3,
    },
    rootDirectory: {
      fontSize: "14px",
      fontWeight: "bold",
      color: theme.font.low.color,
      textTransform: "uppercase",
      cursor: "pointer",
      "& svg": {
        width: "13px",
        height: "13px",
        marginRight: "3px",
        transform: "rotate(0.25turn)",
      },
    },
    fileWrapper: {
      overflowY: "hidden",
      display: "flex",
      height: "calc(100% - 21px)",
      flexDirection: "column",
      "&:hover": {
        overflowY: "auto",
      },
    },
    rootClose: {
      height: "0px !important",
    },
    rootRotate: {
      "&>svg": {
        transform: "rotate(1turn)",
      },
    },
    depth: {
      width: "100%",
      height: "fit-content",
      display: "block",
      overflowY: "hidden",
      "&>div>svg": {
        transform: "rotate(0.25turn)",
      },
    },
    close: {
      height: "20px !important",
      "&>div>svg": {
        transform: "rotate(1turn)",
      },
    },
    file: {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      color: theme.font.high.color,
      opacity: 1,
      "&>svg": {
        width: "12px",
        height: "12px",
        marginRight: "3px",
      },
      "&>span": {
        width: "12px",
        height: "12px",
        marginRight: "4px",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: 1,
      },
      "&>input": {
        outline: "none",
        border: "none",
        backgroundColor: theme.backgroundColor.step2,
        color: theme.font.high.color,
      },
      "&:hover": {
        backgroundColor: theme.hover,
      },
    },
    cpp: {
      backgroundImage: `url('https://github.com/vscode-icons/vscode-icons/raw/master/icons/file_type_cpp2.svg')`,
    },
    c: {
      backgroundImage: `url('https://github.com/vscode-icons/vscode-icons/raw/master/icons/file_type_c2.svg')`,
    },
    typescript: {
      backgroundImage: `url('https://github.com/vscode-icons/vscode-icons/raw/master/icons/file_type_typescript.svg')`,
    },
    javascript: {
      backgroundImage: `url('https://github.com/vscode-icons/vscode-icons/raw/master/icons/file_type_js.svg')`,
    },
    go: {
      backgroundImage: `url('https://github.com/vscode-icons/vscode-icons/raw/master/icons/file_type_go.svg')`,
    },
    python: {
      backgroundImage: `url('https://github.com/vscode-icons/vscode-icons/raw/master/icons/file_type_python.svg')`,
    },
    cs: {
      backgroundImage: `url('https://github.com/vscode-icons/vscode-icons/raw/master/icons/file_type_csharp.svg')`,
    },
    json: {
      backgroundImage: `url('https://github.com/vscode-icons/vscode-icons/raw/master/icons/file_type_json.svg')`,
    },
    jsx: {
      backgroundImage: `url('https://github.com/vscode-icons/vscode-icons/raw/master/icons/file_type_reactjs.svg')`,
    },
    tsx: {
      backgroundImage: `url('https://github.com/vscode-icons/vscode-icons/raw/master/icons/file_type_reactts.svg')`,
    },
    image: {
      backgroundImage: `url('http')`,
    },
    svg: {
      backgroundImage: `url('http')`,
    },
    icon: {
      backgroundImage: `url('http')`,
    },
    tsconfig: {
      backgroundImage: `url('https://github.com/vscode-icons/vscode-icons/raw/master/icons/file_type_typescript_official.svg')`,
    },
    yaml: {
      backgroundImage: `url('http')`,
    },
    xml: {
      backgroundImage: `url('http')`,
    },
    docker: {
      backgroundImage: `url('http')`,
    },
    jenkins: {
      backgroundImage: `url('http')`,
    },
    vue: {
      backgroundImage: `url('http')`,
    },
    env: {
      backgroundImage: `url('https://github.com/vscode-icons/vscode-icons/raw/master/icons/file_type_config.svg')`,
    },
    html: {
      backgroundImage: `url('http')`,
    },
    css: {
      backgroundImage: `url('http')`,
    },
    scss: {
      backgroundImage: `url('http')`,
    },
    aspx: {
      backgroundImage: `url('http')`,
    },
    ascx: {
      backgroundImage: `url('http')`,
    },
    asm: {
      backgroundImage: `url('http')`,
    },
    cake: {
      backgroundImage: `url('http')`,
    },
    php: {
      backgroundImage: `url('http')`,
    },
    sql: {
      backgroundImage: `url('http')`,
    },
    h: {
      backgroundImage: `url('http')`,
    },
    hpp: {
      backgroundImage: `url('http')`,
    },
    coffee: {
      backgroundImage: `url('http')`,
    },
    d: {
      backgroundImage: `url('http')`,
    },
    r: {
      backgroundImage: `url('http')`,
    },
    t: {
      backgroundImage: `url('http')`,
    },
    dockerCompose: {
      backgroundImage: `url('http')`,
    },
    ejs: {
      backgroundImage: `url('http')`,
    },
    terraform: {
      backgroundImage: `url('http')`,
    },
    fsproj: {
      backgroundImage: `url('http')`,
    },
    graphQL: {
      backgroundImage: `url('http')`,
    },
    gradle: {
      backgroundImage: `url('http')`,
    },
    gulpfile: {
      backgroundImage: `url('http')`,
    },
    haml: {
      backgroundImage: `url('http')`,
    },
    handlebars: {
      backgroundImage: `url('http')`,
    },
    java: {
      backgroundImage: `url('http')`,
    },
    jar: {
      backgroundImage: `url('http')`,
    },
    jsp: {
      backgroundImage: `url('http')`,
    },
    key: {
      backgroundImage: `url('http')`,
    },
    ls: {
      backgroundImage: `url('http')`,
    },
    liquid: {
      backgroundImage: `url('http')`,
    },
    hxp: {
      backgroundImage: `url('http')`,
    },
    lua: {
      backgroundImage: `url('http')`,
    },
    cr: {
      backgroundImage: `url('http')`,
    },
    ex: {
      backgroundImage: `url('http')`,
    },
    xls: {
      backgroundImage: `url('http')`,
    },
    pp: {
      backgroundImage: `url('http')`,
    },
    docx: {
      backgroundImage: `url('http')`,
    },
    pdf: {
      backgroundImage: `url('http')`,
    },
    re: {
      backgroundImage: `url('http')`,
    },
    res: {
      backgroundImage: `url('http')`,
    },
    ruby: {
      backgroundImage: `url('http')`,
    },
    rust: {
      backgroundImage: `url('http')`,
    },
    sbt: {
      backgroundImage: `url('http')`,
    },
    scala: {
      backgroundImage: `url('http')`,
    },
    fish: {
      backgroundImage: `url('http')`,
    },
    slang: {
      backgroundImage: `url('http')`,
    },
    bash: {
      backgroundImage: `url('http')`,
    },
    solidity: {
      backgroundImage: `url('http')`,
    },
    ai: {
      backgroundImage: `url('http')`,
    },
    readme: {
      backgroundImage: `url('http')`,
    },
    md: {
      backgroundImage: `url('http')`,
    },
    gitignore: {
      backgroundImage: `url('http')`,
    },

    group: {},

    added: {},
    modified: {},
    untracked: {},
    deleted: {},
    crashed: {},
    renamed: {},
    submodules: {},
    error: {},
    open: {},

    fileFunctionMenu: {
      position: "absolute",
      left: 0,
      top: 0,
      width: "250px",
      backgroundColor: theme.backgroundColor.step1,
      padding: "4px 0px",
      zIndex: 999,
    },
    fileMenu: {
      fontSize: "11px",
      height: "27px",
      lineHeight: "27px",
      display: "flex",
      justifyContent: "space-between",
      color: theme.font.high.color,
      padding: "0px 20px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: theme.backgroundColor.step0,
      },
    },
    divider: {
      margin: "4px 0px",
      borderTop: "1px solid",
      borderTopColor: theme.divider,
    },

    drag: {
      backgroundColor: theme.backgroundColor.step2,
    },
    dragWrapper: {},

    emptySpace: {
      flex: 1,
      backgroundColor: theme.backgroundColor.step3,
    },
  })
);

export const terminalStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    terminal: {},
  })
);

export const tabStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    tab: {
      flex: "0 0 auto",
      minWidth: "112px",
      width: "fit-content",
      height: "100%",
      zIndex: 999,
      display: "flex",
      alignItems: "center",
      padding: "2px 12px",
      cursor: "pointer",
      fontSize: "0px",
      backgroundColor: theme.editor.tab,
      "&:hover": {
        "&>div>svg": {
          visibility: "visible",
        },
      },
      "&>span": {
        width: "16px",
        height: "16px",
        marginRight: "4px",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      },
      "&>svg": {
        width: "16px",
        height: "16px",
        marginRight: "4px",
      },
    },
    active: {
      backgroundColor: theme.editor.active,
      color: theme.font.high.color,
      "&>div": {
        opacity: 0.9,
      },
      "&>div>svg": {
        visibility: "visible",
        opacity: 0.9,
      },
    },
    text: {
      color: theme.font.low.color,
      opacity: 0.5,
      marginRight: "8px",
      fontSize: "14px",
    },
    closeButton: {
      display: "flex",
      alignItems: "center",
      zIndex: 999,
      position: "relative",
      "&>svg": {
        visibility: "hidden",
        color: theme.font.high.color,
        opacity: 0.5,
        width: "15px",
        height: "15px",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderRadius: "7.5px",
        },
      },
    },
    isChanged: {},
    drag: {
      backgroundColor: theme.editor.drag.tab,
      "&>div": {
        pointerEvents: "none",
      },
    },

    default: {},

    cpp: {
      backgroundImage: `url('https://github.com/vscode-icons/vscode-icons/raw/master/icons/file_type_cpp2.svg')`,
    },
    c: {
      backgroundImage: `url('https://github.com/vscode-icons/vscode-icons/raw/master/icons/file_type_c2.svg')`,
    },
    typescript: {
      backgroundImage: `url('https://github.com/vscode-icons/vscode-icons/raw/master/icons/file_type_typescript.svg')`,
    },
    javascript: {
      backgroundImage: `url('https://github.com/vscode-icons/vscode-icons/raw/master/icons/file_type_js.svg')`,
    },
    go: {
      backgroundImage: `url('https://github.com/vscode-icons/vscode-icons/raw/master/icons/file_type_go.svg')`,
    },
    python: {
      backgroundImage: `url('https://github.com/vscode-icons/vscode-icons/raw/master/icons/file_type_python.svg')`,
    },
    cs: {
      backgroundImage: `url('https://github.com/vscode-icons/vscode-icons/raw/master/icons/file_type_csharp.svg')`,
    },
    json: {
      backgroundImage: `url('https://github.com/vscode-icons/vscode-icons/raw/master/icons/file_type_json.svg')`,
    },
    jsx: {
      backgroundImage: `url('https://github.com/vscode-icons/vscode-icons/raw/master/icons/file_type_reactjs.svg')`,
    },
    tsx: {
      backgroundImage: `url('https://github.com/vscode-icons/vscode-icons/raw/master/icons/file_type_reactts.svg')`,
    },
    image: {
      backgroundImage: `url('http')`,
    },
    svg: {
      backgroundImage: `url('http')`,
    },
    icon: {
      backgroundImage: `url('http')`,
    },
    tsconfig: {
      backgroundImage: `url('https://github.com/vscode-icons/vscode-icons/raw/master/icons/file_type_typescript_official.svg')`,
    },
    yaml: {
      backgroundImage: `url('http')`,
    },
    xml: {
      backgroundImage: `url('http')`,
    },
    docker: {
      backgroundImage: `url('http')`,
    },
    jenkins: {
      backgroundImage: `url('http')`,
    },
    vue: {
      backgroundImage: `url('http')`,
    },
    env: {
      backgroundImage: `url('https://github.com/vscode-icons/vscode-icons/raw/master/icons/file_type_config.svg')`,
    },
    html: {
      backgroundImage: `url('http')`,
    },
    css: {
      backgroundImage: `url('http')`,
    },
    scss: {
      backgroundImage: `url('http')`,
    },
    aspx: {
      backgroundImage: `url('http')`,
    },
    ascx: {
      backgroundImage: `url('http')`,
    },
    asm: {
      backgroundImage: `url('http')`,
    },
    cake: {
      backgroundImage: `url('http')`,
    },
    php: {
      backgroundImage: `url('http')`,
    },
    sql: {
      backgroundImage: `url('http')`,
    },
    h: {
      backgroundImage: `url('http')`,
    },
    hpp: {
      backgroundImage: `url('http')`,
    },
    coffee: {
      backgroundImage: `url('http')`,
    },
    d: {
      backgroundImage: `url('http')`,
    },
    r: {
      backgroundImage: `url('http')`,
    },
    t: {
      backgroundImage: `url('http')`,
    },
    dockerCompose: {
      backgroundImage: `url('http')`,
    },
    ejs: {
      backgroundImage: `url('http')`,
    },
    terraform: {
      backgroundImage: `url('http')`,
    },
    fsproj: {
      backgroundImage: `url('http')`,
    },
    graphQL: {
      backgroundImage: `url('http')`,
    },
    gradle: {
      backgroundImage: `url('http')`,
    },
    gulpfile: {
      backgroundImage: `url('http')`,
    },
    haml: {
      backgroundImage: `url('http')`,
    },
    handlebars: {
      backgroundImage: `url('http')`,
    },
    java: {
      backgroundImage: `url('http')`,
    },
    jar: {
      backgroundImage: `url('http')`,
    },
    jsp: {
      backgroundImage: `url('http')`,
    },
    key: {
      backgroundImage: `url('http')`,
    },
    ls: {
      backgroundImage: `url('http')`,
    },
    liquid: {
      backgroundImage: `url('http')`,
    },
    hxp: {
      backgroundImage: `url('http')`,
    },
    lua: {
      backgroundImage: `url('http')`,
    },
    cr: {
      backgroundImage: `url('http')`,
    },
    ex: {
      backgroundImage: `url('http')`,
    },
    xls: {
      backgroundImage: `url('http')`,
    },
    pp: {
      backgroundImage: `url('http')`,
    },
    docx: {
      backgroundImage: `url('http')`,
    },
    pdf: {
      backgroundImage: `url('http')`,
    },
    re: {
      backgroundImage: `url('http')`,
    },
    res: {
      backgroundImage: `url('http')`,
    },
    ruby: {
      backgroundImage: `url('http')`,
    },
    rust: {
      backgroundImage: `url('http')`,
    },
    sbt: {
      backgroundImage: `url('http')`,
    },
    scala: {
      backgroundImage: `url('http')`,
    },
    fish: {
      backgroundImage: `url('http')`,
    },
    slang: {
      backgroundImage: `url('http')`,
    },
    bash: {
      backgroundImage: `url('http')`,
    },
    solidity: {
      backgroundImage: `url('http')`,
    },
    ai: {
      backgroundImage: `url('http')`,
    },
    readme: {
      backgroundImage: `url('http')`,
    },
    md: {
      backgroundImage: `url('http')`,
    },
    gitignore: {
      backgroundImage: `url('http')`,
    },
  })
);

export const tabbarStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    tabbar: {
      width: "100%",
      height: "35px",
    },
    section: {
      width: "100%",
      height: "100%",
      display: "flex",
      overflowX: "auto",
      whiteSpace: "nowrap",
    },
    drag: {
      backgroundColor: theme.editor.drag.tabbar,
    },
    emptySpace: {
      flex: 1,
      backgroundColor: theme.editor.tabbar,
    },
  })
);

export const pathStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    pathWrapper: {
      width: "100%",
      height: "20px",
      backgroundColor: theme.editor.path,
      boxShadow: "rgba(0, 0, 0, 0.6) 0px 5px 5px -5px",
      position: "fixed",
      paddingLeft: "15px",
    },
    path: {
      color: theme.font.low.color,
      opacity: 0.5,
      "&:hover": {
        opacity: 0.8,
      },
    },
    icon: {},
    divider: {},
  })
);

export const editorStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    editor: {
      width: "100%",
      height: "100%",
      backgroundColor: theme.backgroundColor.step3,
      "& *": {
        transition: "none !important",
      },
    },
    topbar: {
      width: "100%",
      height: "55px",
    },
    editorWrapper: {
      width: "100%",
      height: "100%",
      position: "relative",
      zIndex: 1,
    },
    drag: {
      width: "100%",
      height: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 999,
      opacity: 0.2,
      display: "flex",
    },
    center: {
      backgroundColor: theme.editor.drag.code,
      width: "100%",
      height: "100%",
    },
    left: {
      backgroundColor: theme.editor.drag.code,
      width: "50%",
      height: "100%",
    },
    right: {
      backgroundColor: theme.editor.drag.code,
      width: "50%",
      height: "100%",
    },
    top: {
      backgroundColor: theme.editor.drag.code,
      width: "100%",
      height: "50%",
    },
    bottom: {
      backgroundColor: theme.editor.drag.code,
      width: "100%",
      height: "50%",
    },
    leftWrapper: {
      justifyContent: "flex-start",
    },
    rightWrapper: {
      justifyContent: "flex-end",
    },
    topWrapper: {
      alignItems: "flex-start",
    },
    bottomWrapper: {
      alignItems: "flex-end",
    },
    wrapperDrag: {
      "& *": {
        pointerEvents: "none",
      },
    },
  })
);

export const editorLayoutStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    row: {
      width: "100%",
      height: "100%",
      overflow: "hidden",
      display: "flex",
    },
    column: {
      width: "100%",
      height: "100%",
      backgroundColor: theme.backgroundColor.step3,
      display: "flex",
      flexDirection: "column",
    },
  })
);
