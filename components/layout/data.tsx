import DashboardIcon from '@material-ui/icons/Dashboard';
import CodeRoundedIcon from '@material-ui/icons/CodeRounded';
import ChatIcon from '@material-ui/icons/Chat';
import CreateIcon from '@material-ui/icons/Create';
import SettingsIcon from '@material-ui/icons/Settings';
import EqualizerIcon from '@material-ui/icons/Equalizer';

export const sidebarData = {
    dashboard: {
        url: "/",
        icon: <DashboardIcon />,
        title: "Dashboard",
    },
    code: {
        url: "/codeview",
        icon: <CodeRoundedIcon />,
        title: "Code",
    },
    chat: {
        url: "/chat",
        icon: <ChatIcon />,
        title: "Message",
    },
    note: {
        url: "/note",
        icon: <CreateIcon />,
        title: "Note",
    },
    stat: {
        url: "/stat",
        icon: <EqualizerIcon />,
        title: "Server Stat",
    },
    setting: {
        url: "/setting",
        icon: <SettingsIcon />,
        title: "Setting",
    },
};
