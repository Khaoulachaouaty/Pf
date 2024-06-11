import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  Avatar,
  styled,
  useTheme,
  Typography,
  Tooltip,
  Box,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { useLocation, useNavigate } from "react-router-dom";
import { grey } from "@mui/material/colors";
import { useEffect, useState } from "react";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { ShoppingCart } from "@mui/icons-material";
import { History } from "@mui/icons-material";
import ListIcon from '@mui/icons-material/List';
import { userService } from "../../services/user_service";
import { imageService } from "../../services/image_service";

const drawerWidth = 240;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
  // @ts-ignore
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Array1 = [
  { text: "Tableau de bord", icon: <HomeOutlinedIcon />, path: "accueil" },
  { text: "Liste de demandes", icon: <ListIcon />, path: "demandes" },
  { text: "Article", icon: <ShoppingCart />, path: "article" },
  { text: "Historique", icon: <History />, path: "historique" },
];

const SideBar = ({ open, handleDrawerClose }) => {
  let location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const CustomDrawer = styled(Drawer)({
    "& .MuiDrawer-paper": {
      backgroundColor: theme.palette.mode === "light" ? "#164c63" : "#020303", // Remplacez #VotreCouleur par la couleur souhaitée
    },
  });

  const [selectedItem, setSelectedItem] = useState("");

  const handleItemClick = (path) => {
    setSelectedItem(path); // Met à jour l'élément sélectionné
    navigate(path); // Navigue vers l'URL correspondante
    console.log(path);
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
console.log(profile)

useEffect(() => {
  // const interval = setInterval(() => {
    loadProfile();
  // }, 1000); // Vérifie toutes les 5 secondes

  // return () => clearInterval(interval);
}, []);

  const [im, setIm] = useState(null);

  useEffect(() => {
    if (profile.imageId) {
      imageService.getImage(profile.imageId).then((res) => setIm(res));
    }
  }, [profile.imageId]);
  
  return (
    <CustomDrawer variant="permanent" open={open}>
      <DrawerHeader>
        <Typography variant="h6" style={{ color: "#ffffff" }}>
          MyTicket
        </Typography>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon style={{ color: "#ffffff" }} />
          ) : (
            <ChevronLeftIcon style={{ color: "#ffffff" }} />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Box sx={{ height: "10px" }} />
      <Avatar
        sx={{
          mx: "auto",
          width: open ? 88 : 44,
          height: open ? 88 : 44,
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
      <Typography
        align="center"
        sx={{ fontSize: open ? 17 : 0, transition: "0.25s", color: "#ffffff" }}
      >
        {profile.prenom} {profile.nom}
      </Typography>
      <Typography
        align="center"
        sx={{
          fontSize: open ? 15 : 0,
          transition: "0.25s",
          color: "#b1d9ff"
        }}
      >
         {profile.role}
      </Typography>
      <Box sx={{ height: "10px" }} />
      <Divider />
      <List>
        {Array1.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ display: "block" }}>
            <Tooltip title={item.text} placement="left">
              <ListItemButton
                onClick={() => handleItemClick(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: "center",
                  px: 2.5,
                  bgcolor:
                    selectedItem === item.path // Vérifie si l'élément est sélectionné
                      ? theme.palette.mode === "dark"
                        ? grey[800]
                        : "#3b757f"
                      : null,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "#ffffff",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: open ? 1 : 0,
                    color: "#ffffff",
                  }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      <Divider />
    </CustomDrawer>
  );
};

export default SideBar;
