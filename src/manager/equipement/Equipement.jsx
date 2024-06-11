import { useEffect, useState } from "react";
import { Box, Typography, styled, useTheme } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { alpha } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { adminService } from "../../services/equipement_service";
import Header from "../../admin/components/Header";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: "30%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
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
    width: "100px",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Equipement = () => {
  const theme = useTheme();

  const cardStyles = {
    backgroundColor: theme.palette.mode === "light" ? "#f3f8fb" : "#292929",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    padding: "16px",
    marginBottom: "16px",
    transition: "transform 0.2s ease-in-out",
    width: "250px",
    border: "none",
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

  const [searchResults, setSearchResults] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState("");

  useEffect(() => {
    loadEquipements();
  }, []);

  const loadEquipements = async () => {
    try {
      const response = await adminService.getAllEquipements();
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filterEquipements = async (event) => {
    const libelle = event.target.value.toLowerCase();
    setSearchInputValue(libelle);
    try {
      if (libelle.trim() === "") {
        await loadEquipements();
      } else {
        const filteredResults = searchResults.filter((eqm) =>
          eqm.eqptDesignation.toLowerCase().includes(libelle)
        );
        setSearchResults(filteredResults);
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
          alignItems: "center",
          marginBottom: 2,
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
          Equipements
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
          minHigth: 400,
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
            alignItems: "center",
            justifyContent: "space-between",          
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
                Liste des équipements
              </Box>
            }
            subTitle=""
          />
          <Search
            sx={{
              backgroundColor:
                theme.palette.mode === "light" ? "#f3f8fb" : "#6d6d6d",
              width: "200px",
            }}
          >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Chercher…"
              inputProps={{ "aria-label": "search" }}
              value={searchInputValue || ""}
              onChange={filterEquipements}
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
              {searchResults.map((eqm) => (
                <article
                  key={`${eqm.eqptCode}`}
                  style={cardStyles}
                  className="card"
                >
                  <div style={cardContentStyles} className="card-content">
                    <h1 style={libelleStyles} className="designation">
                      {eqm.eqptDesignation}
                    </h1>
                    <p style={codeStyles} className="code">
                      Code: {eqm.eqptCode}
                    </p>
                    <div className="flex icons">
                      <div className="flex"></div>

                      <Link
                        
                        to={`./details?eqptCode=${eqm.eqptCode}`}
                        style={{
                          color:
                            theme.palette.mode === "light"
                              ? "#677f8e"
                              : "#c5d9dc",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          marginLeft:200,
                        }}
                      >
                        <ArrowForwardIcon />
                      </Link>
                    </div>
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

export default Equipement;
