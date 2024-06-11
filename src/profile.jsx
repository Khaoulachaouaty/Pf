import { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  InputAdornment,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const ProfilePage = () => {
  const initialUserData = {
    nom: "Doe",
    prenom: "John",
    age: 30,
    telephone: "0123456789",
    email: "john.doe@example.com",
    username: "johndoe",
    password: "123",
    photo: "https://via.placeholder.com/150",
  };

  const theme = useTheme();

  const [userData, setUserData] = useState(initialUserData);
  const [editMode, setEditMode] = useState(false);
  const [tempUserData, setTempUserData] = useState({});
  const [tempPhoto, setTempPhoto] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [societe, setSociete] = useState("");
  const [poste, setPoste] = useState("");
  const [sexe, setSexe] = useState("");

  const handleEdit = () => {
    setTempUserData(userData);
    setEditMode(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setTempPhoto(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData({ ...tempUserData, photo: tempPhoto || userData.photo });
    setTempUserData({});
    setTempPhoto(null);
    setEditMode(false);
  };

  const handleCancel = () => {
    setTempUserData({});
    setTempPhoto(null);
    setEditMode(false);
  };

  const handlePasswordChange = () => {
    // Vérifier si le mot de passe actuel est correct
    if (currentPassword !== userData.password) {
      console.log("Mot de passe actuel incorrect");
      return;
    }

    // Vérifier si les nouveaux mots de passe sont identiques
    if (newPassword !== confirmPassword) {
      console.log("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    // Si tout est correct, effectuer la modification du mot de passe
    console.log("Mot de passe changé avec succès");
    // Mettre à jour le mot de passe dans les données utilisateur
    setUserData({ ...userData, password: newPassword });
    // Réinitialiser les champs de mot de passe
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const [showPasswordCurrent, setShowPasswordCurrent] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const toggleShowPasswordCurrent = () => {
    setShowPasswordCurrent(!showPasswordCurrent);
  };

  const toggleShowPasswordNew = () => {
    setShowPasswordNew(!showPasswordNew);
  };

  const toggleShowPasswordConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding="20px"
    >
      <Box position="relative">
        <Avatar
          alt="User Photo"
          src={editMode ? tempPhoto || userData.photo : userData.photo}
          sx={{ width: 150, height: 150 }}
        />
        {editMode && (
          <label
            htmlFor="photo-input"
            style={{ position: "absolute", bottom: 0, right: 0 }}
          >
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
              size="small"
            >
              <PhotoCamera />
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
      <Typography variant="h5">
        Profil de {userData.prenom} {userData.nom}
      </Typography>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "600px",
          gap: "10px",
        }}
      >
        <TextField
          label="Nom"
          name="nom"
          value={editMode ? tempUserData.nom || userData.nom : userData.nom}
          onChange={handleChange}
          disabled={!editMode}
        />
        <TextField
          label="Prénom"
          name="prenom"
          value={
            editMode ? tempUserData.prenom || userData.prenom : userData.prenom
          }
          onChange={handleChange}
          disabled={!editMode}
        />
        <TextField
          label="Âge"
          name="age"
          type="number"
          value={editMode ? tempUserData.age || userData.age : userData.age}
          onChange={handleChange}
          disabled={!editMode}
        />
        <TextField
          label="Téléphone"
          name="telephone"
          value={
            editMode
              ? tempUserData.telephone || userData.telephone
              : userData.telephone
          }
          onChange={handleChange}
          disabled={!editMode}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={
            editMode ? tempUserData.email || userData.email : userData.email
          }
          onChange={handleChange}
          disabled={!editMode}
        />
        <TextField
          label="Société"
          name="societe"
          value={editMode ? tempUserData.societe || societe : societe}
          onChange={(e) => setSociete(e.target.value)}
          disabled={!editMode}
        />

        <TextField
          label="Poste"
          name="poste"
          value={editMode ? tempUserData.poste || poste : poste}
          onChange={(e) => setPoste(e.target.value)}
          disabled={!editMode}
        />

        <TextField
          label="Sexe"
          name="sexe"
          value={editMode ? tempUserData.sexe || sexe : sexe}
          onChange={(e) => setSexe(e.target.value)}
          disabled={!editMode}
        />

        <TextField
          label="Nom d'utilisateur"
          name="username"
          value={
            editMode
              ? tempUserData.username || userData.username
              : userData.username
          }
          onChange={handleChange}
          disabled={!editMode}
        />
        {editMode && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Changer le mot de passe</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                display="flex"
                flexDirection="column"
                gap="10px"
                width="100%"
              >
                <TextField
                  label="Mot de passe actuel"
                  type={showPasswordCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={toggleShowPasswordCurrent}>
                          {showPasswordCurrent ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Nouveau mot de passe"
                  type={showPasswordNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={toggleShowPasswordNew}>
                          {showPasswordNew ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Confirmer le nouveau mot de passe"
                  type={showPasswordConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={toggleShowPasswordConfirm}>
                          {showPasswordConfirm ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePasswordChange}
                >
                  Modifier le mot de passe
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        )}
        {editMode ? (
          <div>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor:
                  theme.palette.mode === "light" ? "#613fe7" : "#867ffa",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "light" ? "#5736cc" : "#644fff",
                },
                marginRight: 2,
                flex: 1,
              }}
            >
              Enregistrer
            </Button>
            <Button
              onClick={handleCancel}
              variant="contained"
              color="secondary"
            >
              Annuler
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleEdit}
            variant="contained"
            sx={{
              backgroundColor:
                theme.palette.mode === "light" ? "#613fe7" : "#867ffa",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "light" ? "#5736cc" : "#644fff",
              },
            }}
            startIcon={<EditIcon />}
          >
            Modifier
          </Button>
        )}
      </form>
    </Box>
  );
};

export default ProfilePage;
