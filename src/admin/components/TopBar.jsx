import { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  styled,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar from "@mui/material/AppBar";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Account_service } from "../../services/account_service";
import React from "react";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import Badge from "@mui/material/Badge";
import { userService } from "../../services/user_service";
import { imageService } from "../../services/image_service";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
  // @ts-ignore
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const TopBar = ({ open, handleDrawerOpen, setMode }) => {
  const theme = useTheme();
  let navigate = useNavigate();

  const logout = () => {
    Account_service.logout();
    navigate("/login");
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
    },
  }));

  const [notif, setNotif] = React.useState(null);
  const openNotif = Boolean(notif);
  const handleClickNotif = (event) => {
    setNotif(event.currentTarget);
  };
  const handleCloseNotif = () => {
    setNotif(null);
  };

  const [notifications, setNotifications] = useState([]);
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);

  const handleOpenNotifications = () => {
    // Réinitialisez le compteur de nouvelles notifications
    setNewNotificationsCount(0);
    // Ouvrez le menu des notifications
    handleClickNotif();
  };

  const [profile, setProfile] = useState([]);
  const loadProfile = async () => {
    try {
      const response = await userService.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching articles data:", error);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const [im, setIm] = useState(null);
  useEffect(() => {
    if (profile.imageId) {
      imageService.getImage(profile.imageId).then((res) => setIm(res));
    }
  }, [profile.imageId]);

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: theme.palette.mode === "light" ? "#ffffff" : "#000000",
      }}
      open={open}
    >
      <Toolbar>
        <IconButton
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box flexGrow={1} />

        <Stack direction={"row"}>
          {theme.palette.mode === "light" ? (
            <IconButton
              onClick={() => {
                localStorage.setItem(
                  "currentMode",
                  theme.palette.mode === "dark" ? "light" : "dark"
                );
                setMode((prevMode) =>
                  prevMode === "light" ? "dark" : "light"
                );
              }}
            >
              <LightModeOutlinedIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => {
                localStorage.setItem(
                  "currentMode",
                  theme.palette.mode === "dark" ? "light" : "dark"
                );
                setMode((prevMode) =>
                  prevMode === "light" ? "dark" : "light"
                );
              }}
              color="inherit"
            >
              <DarkModeOutlinedIcon />
            </IconButton>
          )}

          <div>
            <Button
              id="profile-button"
              aria-controls={openMenu ? "profile-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openMenu ? "true" : undefined}
              onClick={handleClick}
            >
              <Stack direction="row" spacing={2}>
                <Avatar
                  sx={{
                    mx: "auto",
                    width: 44,
                    height: 44,
                    my: 1,
                    border: "2px solid grey",
                    transition: "0.25s",
                  }}
                  alt={profile.prenom ? profile.prenom.charAt(0) : ""} // Utilisation de la première lettre du prénom
                  src={im ? `data:${im.data.type};base64,${im.data.image}` : ""}
                >
                  {!im && profile.prenom && profile.prenom.charAt(0)}
                  {/* Affiche la première lettre du prénom si le profil existe et s'il n'y a pas d'image */}
                </Avatar>
              </Stack>
            </Button>
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "profile-button",
              }}
            >
              <MenuItem onClick={handleClose} sx={{minWidth:250}}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    sx={{
                      mx: "auto",
                      width: 44,
                      height: 44,
                      my: 1,
                      border: "2px solid grey",
                      transition: "0.25s",
                    }}
                    alt={profile.prenom ? profile.prenom.charAt(0) : ""} // Utilisation de la première lettre du prénom
                    src={
                      im ? `data:${im.data.type};base64,${im.data.image}` : ""
                    }
                  >
                    {!im && profile.prenom && profile.prenom.charAt(0)}
                    {/* Affiche la première lettre du prénom si le profil existe et s'il n'y a pas d'image */}
                  </Avatar>
                  <div>
                    <div>
                      {profile.prenom} {profile.nom}
                    </div>
                    <div style={{ fontSize: "small", color: "gray" }}>
                      {profile.email}
                    </div>
                  </div>
                </Stack>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  logout();
                }}
              >
                <IconButton color="inherit">
                  <Logout />
                </IconButton>
                Déconnecter
              </MenuItem>
            </Menu>
          </div>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
