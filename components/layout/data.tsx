import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import ChatOutlinedIcon from '@material-ui/icons/ChatOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import DnsOutlinedIcon from '@material-ui/icons/DnsOutlined';

export const sidebarData = {
    dashboard: {
        url: "/",
        icon: <DashboardOutlinedIcon />,
        title: "Dashboard",
    },
    code: {
        url: "/codeview",
        icon: <DnsOutlinedIcon />,
        title: "Code & Contatiner",
        subUrl: ["/code"]
    },
    note: {
        url: "/note",
        icon: <DescriptionOutlinedIcon />,
        title: "Note",
    },
    chat: {
        url: "/chat",
        icon: <ChatOutlinedIcon />,
        title: "Chat",
    },
    setting: {
        url: "/setting",
        icon: <SettingsOutlinedIcon />,
        title: "Setting",
    },
};
