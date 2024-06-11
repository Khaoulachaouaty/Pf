import { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  InputAdornment,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Grid,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { userService } from "../../services/user_service";
import { imageService } from "../../services/image_service";
import CakeIcon from "@mui/icons-material/Cake";
import { CheckCircle } from "@mui/icons-material";

const Profile = () => {
  const [profile, setProfile] = useState({});
  const theme = useTheme();
  const [editMode, setEditMode] = useState(false);
  const [tempUserData, setTempUserData] = useState({});
  const [tempPhoto, setTempPhoto] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(2); // Default selection "Mon profile"
  const [showPasswordCurrent, setShowPasswordCurrent] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [tempPhotoType, setTempPhotoType] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [im, setIm] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [usernameError, setUsernameError] = useState(""); // New state for username error
  const [emailError, setEmailError] = useState(""); // New state for email error
  const [telError, setTelError] = useState("");

  const isPasswordChangeDisabled =
    !currentPassword ||
    !newPassword ||
    !confirmPassword ||
    newPassword !== confirmPassword;

  const loadProfile = async () => {
    try {
      const response = await userService.getProfile();
      setProfile(response.data);
      if (response.data.imageId) {
        const imageResponse = await imageService.getImage(
          response.data.imageId
        );
        setIm(imageResponse);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    setTempUserData({});
    setTempPhoto(null);
    setEditMode(index === 2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "username" && value !== profile.username) {
      setUsernameError("");
    }

    if (name === "email" && value !== profile.email) {
      if (isValidEmail(value)) {
        setEmailError("");
      }
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempPhoto(reader.result.split(",")[1]); // Base64 string
        setTempPhotoType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the username already exists using getAllUsers
    if (tempUserData.username && tempUserData.username !== profile.username) {
      try {
        const response = await userService.getAllUsers();
        const userExists = response.data.some(
          (user) => user.username === tempUserData.username
        );
        if (userExists) {
          setUsernameError("Nom d'utilisateur déjà pris");
          setSnackbar({
            open: true,
            message: "Nom d'utilisateur déjà pris",
            severity: "error",
          });
          return;
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    // Validate email
    if (tempUserData.email && tempUserData.email !== profile.email) {
      if (!isValidEmail(tempUserData.email)) {
        setEmailError("Adresse email invalide");
        return;
      }

      try {
        const response = await userService.getAllUsers();
        const emailExists = response.data.some(
          (user) => user.email === tempUserData.email
        );
        if (emailExists) {
          setEmailError("Adresse email déjà utilisée");
          return;
        } else {
          setEmailError(""); // Clear error if email is valid
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    if (tempUserData.tel.length !== 8) {
      setTelError("Le numéro doit comporter 8 chiffres.");
      return;
    } else {
      setTelError(""); // Clear error if email is valid
    }

    try {
      const formData = new FormData();
      if (tempPhoto) {
        const blob = new Blob(
          [
            new Uint8Array(
              atob(tempPhoto)
                .split("")
                .map((char) => char.charCodeAt(0))
            ),
          ],
          { type: tempPhotoType }
        );
        formData.append("image", blob, "profile.jpg");
      }
      Object.keys(tempUserData).forEach((key) => {
        formData.append(key, tempUserData[key] || profile[key]);
      });

      const response = await userService.updateProfile(formData);
      const updatedData = {
        ...profile,
        ...tempUserData,
        photo: tempPhoto
          ? `data:${tempPhotoType};base64,${tempPhoto}`
          : profile.photo,
        imageId: response.data.imageId,
        imagePath: response.data.imagePath,
      };

      // Update the token in local storage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      setProfile(updatedData);
      setTempUserData({});
      setTempPhoto(null);
      setEditMode(false);
      setSnackbar({
        open: true,
        message: "Profil mis à jour avec succès",
        severity: "success",
      });
      loadProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    setTempUserData({});
    setTempPhoto(null);
    setEditMode(false);
    setUsernameError("");
    setEmailError("");
    setTelError("");
  };

  const handleCancelPassword = () => {
    setTempUserData({});
    setConfirmPassword("");
    setCurrentPassword("");
    setNewPassword("");
    setPasswordError(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError(true);
      return;
    }

    const data = {
      currentPassword,
      newPassword,
      confirmationPassword: confirmPassword,
    };

    try {
      await userService.updatePassword(data);
      console.log("Mot de passe changé avec succès");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError(false);
      setSnackbar({
        open: true,
        message: "Mot de passe changé avec succès",
        severity: "success",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
      setPasswordError(true);
    }
  };

  const toggleShowPasswordCurrent = () => {
    setShowPasswordCurrent(!showPasswordCurrent);
  };

  const toggleShowPasswordNew = () => {
    setShowPasswordNew(!showPasswordNew);
  };

  const toggleShowPasswordConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", severity: "success" });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <Typography
        color="#aebfcb"
        fontSize="30px"
        margin="5px"
        sx={{
          fontWeight: 500,
        }}
      >
        Mon Compte
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 2,
          marginTop: 2,
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.background.main,
            padding: "10px",
            borderRadius: "15px",
            mr: "20px",
            width: "30%",
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            padding="20px"
            marginTop={2}
          >
            <Box position="relative">
              <Avatar
                sx={{ width: 150, height: 150 }}
                alt={profile.prenom ? profile.prenom.charAt(0) : ""}
                src={
                  editMode
                    ? tempPhoto
                      ? `data:${tempPhotoType};base64,${tempPhoto}`
                      : im?.data
                      ? `data:${im.data.type};base64,${im.data.image}`
                      : ""
                    : im?.data
                    ? `data:${im.data.type};base64,${im.data.image}`
                    : ""
                }
              >
                {!im && profile.prenom && profile.prenom.charAt(0)}
              </Avatar>

              {editMode && (
                <label
                  htmlFor="photo-input"
                  style={{ position: "absolute", bottom: 10, right: 0 }}
                >
                  <IconButton
                    aria-label="upload picture"
                    component="span"
                    size="small"
                    sx={{
                      color: theme.palette.mode === "dark" ? "#fff" : "#758dff",
                      backgroundColor:
                        theme.palette.mode === "dark" ? "#6d6d6d" : "#eef3ff",
                    }}
                  >
                    <PhotoCamera sx={{ fontSize: 30 }} />
                  </IconButton>
                </label>
              )}
            </Box>
            <input
              type="file"
              accept="image/*"
              id="photo-input"
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              {profile.prenom} {profile.nom}
            </Typography>
            <Typography color="#7a7b7f">{profile.email}</Typography>
            <Typography color="#7a7b7f">
              <CakeIcon /> {formatDate(profile.dateNaiss)}
            </Typography>
            <Typography color="#7a7b7f">
              Département: {profile.nomDepart}
            </Typography>
            {profile.responsable && (
  <Typography color="#7a7b7f">
    <Box display="flex" alignItems="center">
      Responsable <CheckCircle sx={{ ml: 1 }} />
    </Box>
  </Typography>
)}
          </Box>
          <List
            component="nav"
            aria-label="secondary mailbox folder"
            sx={{ mt: 0 }}
          >
            <ListItemButton
              selected={selectedIndex === 2}
              onClick={(event) => handleListItemClick(event, 2)}
            >
              <ListItemText primary="Mon profile" />
            </ListItemButton>
            <ListItemButton
              selected={selectedIndex === 3}
              onClick={(event) => handleListItemClick(event, 3)}
            >
              <ListItemText primary="Changer mot de passe" />
            </ListItemButton>
          </List>
        </Box>
        <Box
          sx={{
            backgroundColor: theme.palette.background.main,
            padding: "20px",
            borderRadius: "15px",
            width: "70%",
          }}
        >
          {selectedIndex === 2 && (
            <Box sx={{ mt: 4, ml: 2 }}>
              <Typography color="#aebfcb" fontSize="25px" marginBottom="15px">
                Mon profile
              </Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nom d'utilisateur"
                      name="username"
                      value={tempUserData.username || profile.username || ""}
                      onChange={handleChange}
                      variant="outlined"
                      disabled={!editMode}
                      error={!!usernameError}
                      helperText={usernameError}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={tempUserData.email || profile.email || ""}
                      onChange={handleChange}
                      variant="outlined"
                      disabled={!editMode}
                      error={!!emailError}
                      helperText={emailError}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Téléphone"
                      name="tel"
                      value={tempUserData.tel || profile.tel || ""}
                      onChange={handleChange}
                      variant="outlined"
                      disabled={!editMode}
                      error={!!telError}
                      helperText={telError}
                    />
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  {editMode ? (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={
                          Object.keys(tempUserData).length === 0 && !tempPhoto
                        }
                      >
                        Enregistrer
                      </Button>
                      <Button variant="outlined" onClick={handleCancel}>
                        Annuler
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setEditMode(true)}
                    >
                      Modifier
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          )}
          {selectedIndex === 3 && (
            <Box sx={{ mt: 4, ml: 2 }}>
              <Typography color="#aebfcb" fontSize="25px" marginBottom="15px">
                Changer mot de passe
              </Typography>
              <Box component="form" onSubmit={handlePasswordChange}>
                <TextField
                  fullWidth
                  label="Mot de passe actuel"
                  type={showPasswordCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={toggleShowPasswordCurrent}
                          edge="end"
                        >
                          {showPasswordCurrent ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ marginBottom: 2 }}
                  error={passwordError}
                  helperText={passwordError && " mot de passe incorrect"}
                />
                <TextField
                  fullWidth
                  label="Nouveau mot de passe"
                  type={showPasswordNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={toggleShowPasswordNew} edge="end">
                          {showPasswordNew ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  fullWidth
                  label="Confirmer le nouveau mot de passe"
                  type={showPasswordConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={toggleShowPasswordConfirm}
                          edge="end"
                        >
                          {showPasswordConfirm ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isPasswordChangeDisabled}
                  >
                    Enregistrer
                  </Button>
                  <Button variant="outlined" onClick={handleCancelPassword}>
                    Annuler
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        sx={{ marginLeft: 6 }}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
