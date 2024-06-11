import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link, Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Account_service } from "./services/account_service";

const Login = () => {
  let navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: "khaoula",
    password: "123",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await Account_service.login(credentials);
      Account_service.saveToken(response.data.token);
      console.log(response);

      const userRole = response.data.role; // Supposons que le rôle de l'utilisateur soit retourné dans response.data.role

      switch (userRole) {
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        case "CLIENT":
          navigate("/client/accueil");
          break;
        case "MANAGER":
          navigate("/manager/accueil");
          break;
        case "TECHNICIEN":
          navigate("/technicien/accueil");
          break;
        case "MAGASINIER":
          navigate("/magasinier/accueil");
          break;
        default:
          navigate("/"); // Redirige vers une page par défaut si le rôle n'est pas reconnu
      }

      //navigate('/admin/dashboard');
    } catch (error) {
      setError("Erreur lors de la connexion. Veuillez réessayer.");
    }
    setLoading(false);
  };

  const onChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom, #ffffff, #f0f0f0)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            marginBottom: "32px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <AccountCircleIcon sx={{ fontSize: "120px", color: "#333" }} />
        </div>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          sx={{ fontWeight: "medium", color: "#333" }}
        >
          Connectez-vous à votre compte
        </Typography>
        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Nom d'utilisateur"
            name="username"
            autoComplete="username"
            autoFocus
            value={credentials.username}
            onChange={onChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mot de passe"
            type="password"
            id="password"
            autoComplete="current-password"
            value={credentials.password}
            onChange={onChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#333",
              color: "#fff",
              borderRadius: "20px",
              boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
              transition: "background-color 0.3s",
              padding: "10px 40px",
              "&:hover": {
                backgroundColor: "#555",
                boxShadow: "0px 5px 8px rgba(0, 0, 0, 0.2)",
              },
            }}
            disabled={loading}
          >
            {loading ? "Chargement..." : "Se connecter"}
          </Button>
          {error && (
            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 2, color: "#ff0000" }}
            >
              {error}
            </Typography>
          )}
          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 2, color: "#333" }}
          >
            <Link href="/mot-de-passe-oublier">Mot de passe oublié</Link>
          </Typography>
        </Box>
      </div>
    </div>
  );
};

export default Login;
