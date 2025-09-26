import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Chats from './ChatComponents/Chats';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import WebStoriesOutlinedIcon from '@mui/icons-material/WebStoriesOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Avatar, Button, Dialog, ImageListItem, ListItemButton, Menu, MenuItem } from '@mui/material';
import RandomMuiColor from './RandomMuiColor';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomListItemButton from "./CustomListitemButton";
import SettingsDialog from './SettingsDialog';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});
const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({

    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export default function Sidebar({ userId, user }) {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const location = useLocation();
  const [openedDrawer, setOpenedDrawer] = React.useState(false);
  const [selected, setSelected] = React.useState();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [settingsOpen, setSettingsOpen] = React.useState(Boolean(anchorEl))
  const handleClose = () => {
    setSettingsOpen(false);
    setAnchorEl(null);
  };
  React.useEffect(() => {

    const routeNameRegex = /^\/[^\/]+\/([^\/]+)(?:\/[^\/]*)?$/;
    const match = location.pathname.match(routeNameRegex);
    if (match && match[1]) {
      switch (match[1]) {
        case "chats": setSelected("Chats"); break;
        case "updates": setSelected("Status"); break;
        case "calls": setSelected("Calls"); break;
      }
    }
  }, []);
  const handleDrawerOpen = () => {
    setOpenedDrawer(true);
  };
  const handleDrawerClose = () => {
    setOpenedDrawer(false);
  };

  return (
    <>
    <SettingsDialog user={user} open={settingsOpen} setOpen={setSettingsOpen}/> 
      <Drawer
        variant="permanent"
        open={openedDrawer}
        sx={{
          position: "absolute",
          display: { xs: "none", sm: "none", md: "block" },
          '& .MuiDrawer-paper': {
            // position: 'fixed',
            width: openedDrawer ? 240 : 59,
            overflowX: 'hidden',
            transition: (theme) => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: openedDrawer
                ? theme.transitions.duration.enteringScreen
                : theme.transitions.duration.leavingScreen,
            }),
          },
        }}
      >
        <DrawerHeader>
          <IconButton onClick={openedDrawer ? handleDrawerClose : handleDrawerOpen}>
            {openedDrawer ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </DrawerHeader>
        <List>
          {['Chats', 'Calls', 'Status'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <CustomListItemButton  btn={text} onClick={() => { navigateTo(`/${userId}/${text.toLowerCase()}`); setSelected(text) }} selected={selected} open={openedDrawer}>
                <ListItemIcon
                  sx={[{ minWidth: 0, justifyContent: 'center', }, openedDrawer ? { mr: 3 } : { mr: 'auto' },]}
                >
                  {index === 0 ? <ChatOutlinedIcon /> : index === 1 ? <PhoneOutlinedIcon /> : index === 2 ? <WebStoriesOutlinedIcon /> : <></>}
                </ListItemIcon>
                <ListItemText
                  primary={text} sx={[openedDrawer ? { opacity: 1, } : { opacity: 0, },
                  ]}
                />
              </CustomListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List sx={{ display: "flex", flexDirection: "column", alignContent: "space-between" }}>
          <ListItem key={'Beta AI'} disablePadding sx={{ display: 'block' }}>
            <CustomListItemButton  btn={'Beta AI'} onClick={() => { setSelected('Beta AI') }} selected={selected} open={open}>
              <ListItemIcon
                sx={[{ minWidth: 0, justifyContent: 'center', }, openedDrawer ? { mr: 3, } : { mr: 'auto', },]}
              >
                <AutoAwesomeIcon
                  sx={{
                    fontSize: '1.9rem',
                    // color: 'linear-gradient(135deg,rgb(162, 197, 253) 0%,rgb(126, 166, 232) 50%,rgb(156, 71, 204) 100%)',
                    color: "blueviolet"
                  }}
                  style={{
                    // color: 'linear-gradient(135deg, #4285F4 0%, #34A853 30%, #FBBC05 65%, #EA4335 100%)',
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={'Beta AI'}
                sx={[openedDrawer ? { opacity: 1, } : { opacity: 0, },]}
              />
            </CustomListItemButton>
          </ListItem>
        </List>
        <Divider sx={{ mt: "auto" }} />
        <List sx={{ display: "flex", flexDirection: "column", alignContent: "space-between" }}>
          <ListItem onClick={() => { setSettingsOpen("settings") }} key={'Settings'} disablePadding sx={{ display: 'block' }}>
            <CustomListItemButton  btn={'Settings'} onClick={() => { setSelected('Settings') }} selected={selected} open={openedDrawer}>
              <ListItemIcon sx={[{ minWidth: 0, justifyContent: 'center' }, openedDrawer ? { mr: 3 } : { mr: 'auto' }]}>
                <SettingsOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                primary={'Settings'}
                sx={[openedDrawer ? { opacity: 1, } : { opacity: 0, },]}
              />
            </CustomListItemButton>
          </ListItem>
          <ListItem key={'Profile'} disablePadding sx={{ display: 'block' }} onClick={(e) => { setSelected('Profile'), setAnchorEl(e.currentTarget); setSettingsOpen("profile") }}>
            <CustomListItemButton  btn={'Profile'} selected={selected} open={openedDrawer}>
              <ListItemIcon
                sx={[{ minWidth: 0, justifyContent: 'center' }, openedDrawer ? { mr: 3 } : { mr: 'auto' }]}
              >{user ?
                <Avatar alt={user?.name} src={user?.ui?.dp} sx={{ width: '2rem', height: '2rem', border: "solid grey 1px", borderRadius: "50%", bgcolor: RandomMuiColor() }} />
                :
                <Avatar alt="wispr" src="dp.jpg"
                  sx={{ width: '2rem', height: '2rem', border: "solid grey 1px", borderRadius: "50%", bgcolor: RandomMuiColor() }} />
                }
              </ListItemIcon>
              <ListItemText
                primary={'Profile'}
                sx={[openedDrawer ? { opacity: 1, } : { opacity: 0, },]}
              />
            </CustomListItemButton>
          </ListItem>
        </List>
      </Drawer></>
  );
}
