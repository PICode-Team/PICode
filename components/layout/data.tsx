import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import ChatOutlinedIcon from '@material-ui/icons/ChatOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import DnsOutlinedIcon from '@material-ui/icons/DnsOutlined';
import ComputerOutlinedIcon from '@material-ui/icons/ComputerOutlined';
import WorkOutlineOutlinedIcon from '@material-ui/icons/WorkOutlineOutlined';

export const sidebarData = {
    dashboard: {
        url: "/",
        icon: <DashboardOutlinedIcon />,
        title: "Dashboard",
    },
    workspace: {
        icon: <WorkOutlineOutlinedIcon />,
        title: "Workspace",
        children: [
            {
                url: "/codeview",
                icon: <DnsOutlinedIcon />,
                title: "Code",
                subUrl: ["/code"]
            },
            {
                url: "/container",
                icon: <ComputerOutlinedIcon />,
                title: "Container",
            },
        ],
        subUrl: ["/code", "/codeview", "/container"]
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
