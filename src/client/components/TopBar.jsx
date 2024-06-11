import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { Logout } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { Account_service } from "../../services/account_service";
import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
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

const TopBar = ({ open, setMode }) => {
  const theme = useTheme();
  let navigate = useNavigate();

  const logout = () => {
    Account_service.logout();
    navigate("/login");
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [profile, setProfile] = useState({});
  const loadProfile = async () => {
    try {
      const response = await userService.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      loadProfile();
    }, 1000); // Vérifie toutes les 5 secondes
  
    return () => clearInterval(interval);
  }, []);

  const [im, setIm] = useState(null);
  useEffect(() => {
    if (profile.imageId) {
     const a = imageService.getImage(profile.imageId).then((res) => setIm(res));
     console.log(a)
    }
  }, [profile.imageId]);

  console.log(im)

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: theme.palette.mode === "light" ? "#0e7190" : "#000000",
      }}
      // @ts-ignore
      open={open}
    >
      <Toolbar>
        <Typography variant="h6" fontSize={30} noWrap sx={{ flexGrow: 1 }}>
          Interventix
        </Typography>
        <Button color="inherit" onClick={() => navigate("accueil")}>
          Accueil
        </Button>
        <Button color="inherit" onClick={() => navigate("creer-ticket")}>
          Créer Ticket
        </Button>
        <Button color="inherit" onClick={() => navigate("consulter_tickets")}>
          Consulter Tickets
        </Button>
        <Button color="inherit" onClick={() => navigate("feedback")}>
          Avis
        </Button>
        <Button color="inherit" onClick={() => navigate("historique")}>
          Historique des Tickets
        </Button>
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
              color="inherit"
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
          <IconButton color="inherit">
            <NotificationsNoneOutlinedIcon />
          </IconButton>
          <div>
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
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
              id="basic-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleClose} component={Link} to="profile" sx={{minWidth:250}}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    sx={{
                      mx: "auto",
                      width: 44,
                      height:44,
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
