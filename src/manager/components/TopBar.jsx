import { useEffect, useState, useRef } from "react";
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
  Typography,
  Avatar,
  Badge
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar from "@mui/material/AppBar";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Account_service } from "../../services/account_service";
import { Link } from "react-router-dom";
import { userService } from "../../services/user_service";
import { imageService } from "../../services/image_service";
import { notificationService } from "../../services/notification_service";
import moment from "moment";
import 'moment/dist/locale/fr';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
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

  const [anchorEl, setAnchorEl] = useState(null);
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

  const [notif, setNotif] = useState(null);
  const openNotif = Boolean(notif);
  const handleClickNotif = (event) => {
    setNotif(event.currentTarget);
    markNotificationsAsRead();
  };
  const handleCloseNotif = () => {
    setNotif(null);
  };

  const [notifications, setNotifications] = useState([]);
  const [previousNotifications, setPreviousNotifications] = useState([]);
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);
  const [notificationImages, setNotificationImages] = useState({});
  const [userInteracted, setUserInteracted] = useState(false);

  const audioRef = useRef(null);

  const handleOpenNotifications = () => {
    setNewNotificationsCount(0);
    handleClickNotif();
  };

  const loadNotifications = async () => {
    try {
      const { data } = await notificationService.getNotifications();
      const unseenCount = data.filter((notification) => !notification.seen).length;

      // Compare previous notifications with the current notifications
      const newNotifications = data.filter(notification => 
        !previousNotifications.some(prev => prev.id === notification.id)
      );

      if (newNotifications.length > 0 && userInteracted) {
        if (audioRef.current) {
          audioRef.current.play().catch(error => {
            console.error("Error playing notification sound:", error);
          });
        }
      }

      // Trier les notifications par date de création, les plus récentes en premier
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setNotifications(data);
      setNewNotificationsCount(unseenCount);
      setPreviousNotifications(data);

      const imagePromises = data.map(async (notification) => {
        if (notification.idImage) {
          const imageResponse = await imageService.getImage(notification.idImage);
          return { id: notification.id, image: imageResponse };
        }
        return null;
      });
      const images = await Promise.all(imagePromises);
      const imageMap = {};
      images.forEach((img) => {
        if (img) {
          imageMap[img.id] = img.image;
        }
      });
      setNotificationImages(imageMap);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      await notificationService.marquerLue();
      loadNotifications();
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [userInteracted]);

  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);
      document.removeEventListener("click", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
    };
  }, []);

  const [profile, setProfile] = useState([]);
  const loadProfile = async () => {
    try {
      const response = await userService.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    // const interval = setInterval(() => {
      loadProfile();
    // }, 1000); // Vérifie toutes les 5 secondes

    // return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // const interval = setInterval(() => {
      loadNotifications();
    // }, 5000); // Vérifie toutes les 5 secondes

    // return () => clearInterval(interval);
  }, []);

  const [im, setIm] = useState(null);
  useEffect(() => {
    if (profile.imageId) {
      imageService.getImage(profile.imageId).then((res) => setIm(res));
    }
  }, [profile.imageId]);

  moment.locale("fr");
  const timeAgo = (date) => {
    return moment(date).fromNow();
  };

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

        <Stack direction={"row"} alignItems="center">
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
            <IconButton
              id="basic-button"
              aria-controls={openNotif ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openNotif ? "true" : undefined}
              onClick={handleClickNotif}
              aria-label="notifications"
            >
              <NotificationsNoneOutlinedIcon sx={{ fontSize: 27 }} />
              <StyledBadge
                badgeContent={newNotificationsCount}
                color="error"
                max={99}
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  transform: "scale(0.80)",
                  marginRight: 2,
                }}
              />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={notif}
              open={openNotif}
              onClose={handleCloseNotif}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              PaperProps={{
                style: {
                  height: 500,
                  width: "100%",
                  maxWidth: "360px",
                },
              }}
            >
              {notifications.length ? (
                notifications.map((notification, index) => (
                  <MenuItem
                    key={index}
                    onClick={handleCloseNotif}
                    sx={{
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      width="100%"
                    >
                      <Avatar
                        alt="Notification Avatar"
                        src={
                          notification.idImage
                            ? `data:${notificationImages[notification.id]?.data.type};base64,${notificationImages[notification.id]?.data.image}`
                            : "/path/to/default/avatar/image.jpg"
                        }
                      />
                      <Stack direction="column" width="100%">
                        <Typography
                          variant="body2"
                          sx={{ wordBreak: "break-word" }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                        >
                          {timeAgo(notification.createdAt)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </MenuItem>
                ))
              ) : (
                <Typography
                  variant="body2"
                  sx={{ padding: "8px 16px" }}
                >
                  Aucun notification
                </Typography>
              )}
            </Menu>
          </div>

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
                  alt={profile.prenom ? profile.prenom.charAt(0) : ""}
                  src={im ? `data:${im.data.type};base64,${im.data.image}` : ""}
                >
                  {!im && profile.prenom && profile.prenom.charAt(0)}
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
              <MenuItem
                onClick={handleClose}
                component={Link}
                to="profile"
                sx={{ minWidth: 250 }}
              >
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
                    alt={profile.prenom ? profile.prenom.charAt(0) : ""}
                    src={
                      im ? `data:${im.data.type};base64,${im.data.image}` : ""
                    }
                  >
                    {!im && profile.prenom && profile.prenom.charAt(0)}
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
      <audio ref={audioRef} src="/sounds/notification_sound.mp3" />
    </AppBar>
  );
};

export default TopBar;
