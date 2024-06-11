import { Box, Typography, styled, useTheme } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { alpha } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import * as React from "react";
import { useEffect } from "react";
import { adminService } from "../../services/equipement_service";
import Header from "../../admin/components/Header";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: "200px", // Ajuster la largeur du composant de recherche
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100px", // Largeur fixe de l'entrée de texte
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const EqType = () => {
  const theme = useTheme();

  const cardStyles = {
    backgroundColor: theme.palette.mode === "light" ? "#f3f8fb" : "#292929",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    padding: "16px",
    marginBottom: "16px",
    transition: "transform 0.2s ease-in-out",
    width: "250px", // Largeur des cartes
    border: "none", // Éliminer le contour
  };

  const cardContentStyles = {
    display: "flex",
    flexDirection: "column",
  };

  const libelleStyles = {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "8px",
  };

  const codeStyles = {
    fontSize: "1rem",
    color: theme.palette.mode === "light" ? "#666666" : "#e7e7e7",
  };

  const [types, setTypes] = React.useState([]);
  const [searchResults, setSearchResults] = React.useState([]);
  const [searchInputValue, setSearchInputValue] = React.useState("");

  useEffect(() => {
    loadType();
  }, []);

  const loadType = async () => {
    try {
      const response = await adminService.getAllTypes();
      setTypes(response.data);
      setSearchResults(response.data); // Initialiser searchResults avec toutes les données
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const Filter = async (event) => {
    const libelle = event.target.value.toLowerCase();
    setSearchInputValue(libelle); // Mettre à jour la valeur de recherche
    try {
      if (libelle.trim() === "") {
        // Si le champ de recherche est vide, charger tous les équipements
        await loadType();
      } else {
        const response = await adminService.FilterType(libelle);
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error("Error filtering data:", error);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center", // Ajout de cette ligne pour aligner verticalement les éléments
          marginBottom: 2,
        }}
      >
        <Typography
          color="#aebfcb"
          fontSize="30px"
          margin="5px"
          sx={{
            fontWeight: 500, // épaisseur de la police
          }}
        >
          Equipements Type
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.background.main
              : theme.palette.background.main,
          padding: "20px",
          borderRadius: "15px",
        }}
      >
        <Box
          sx={{
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.background.main
                : theme.palette.background.main,
            padding: "20px",
            borderRadius: "15px",
            display: "flex",
            alignItems: "center", // Centrer verticalement
            justifyContent: "space-between", // Espacer les éléments horizontalement
          }}
        >
          <Header
            title={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: theme.palette.primary.main,
                }}
              >
                Liste des equipements Type
              </Box>
            }
            subTitle=""
          />
          <Search
            sx={{
              backgroundColor:
                theme.palette.mode === "light" ? "#f3f8fb" : "6d6d6d",
              width: "200px", // Ajuster la largeur du composant de recherche
            }}
          >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Chercher…"
              inputProps={{ "aria-label": "search" }}
              value={searchInputValue || ""}
              onChange={Filter}
            />
          </Search>
        </Box>

        <Box sx={{ gap: 3 }} my={1}>
          <main className="flex">
            <section
              className="flex right-section"
              style={{ justifyContent: "flex-start" }}
            >
              {searchInputValue !== "" && searchResults.length === 0 && (
                <p>Aucun résultat trouvé pour `{searchInputValue}`</p>
              )}
              {searchResults.map((type) => (
                <article
                  key={`${type.eqtyCode}`}
                  style={cardStyles}
                  className="card"
                >
                  <div style={cardContentStyles} className="card-content">
                    <h2 style={libelleStyles} className="libelle">
                      {type.eqtyLibelle}
                    </h2>
                    <p style={codeStyles} className="code">
                      Code: {type.eqtyCode}
                    </p>
                    <p style={codeStyles} className="icone">
                      Icone: {type.eqtyIcone}
                    </p>
                    <p style={codeStyles} className="machine">
                      Machine: {type.eqtyMachine === "O" ? "Oui" : "Non"}
                    </p>
                  </div>
                </article>
              ))}
            </section>
          </main>
        </Box>
      </Box>
    </Box>
  );
};

export default EqType;
