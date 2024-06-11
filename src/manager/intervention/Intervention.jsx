import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Avatar,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { Box, styled } from "@mui/material";
import { EditNote, RemoveRedEyeOutlined, Clear } from "@mui/icons-material";
import Header from "../../admin/components/Header";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { ticketService } from "../../services/ticke_servicet";
import { ConfirmationNumberOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Slide from "@mui/material/Slide";
import { format } from "date-fns";
import { technicienService } from "../../services/technicien_service";
import { demandeurService } from "../../services/demandeur_service";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CircleIcon = styled(ConfirmationNumberOutlined)({
  borderRadius: "50%",
  backgroundColor: "#417d99", // couleur de votre choix
  padding: "5px",
  fontSize: "38px",
  color: "#fff", // couleur du texte
});

const Intervention = () => {
  const theme = useTheme();

  const [dataRows, setDataRows] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  // useEffect(() => {
  //   ticketService
  //     .getAllTickets()
  //     .then((response) => {
  //       const updatedDataRows = response.data.map((item) => ({
  //         ...item,
  //         id: item.interCode,
  //       }));
  //       setDataRows(updatedDataRows);
  //       console.log("ticket", response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ticketService.getAllTickets();
        const ticketData = response.data;
        console.log(response.data, "***");

        // Fetch technicien and demandeur data for each ticket
        const updatedDataRows = await Promise.all(
          ticketData.map(async (item) => {
            let technicienData = null;
            let demandeurData = null;

            // Fetch technicien data
            if (item.technicien && !item.technicien.user) {
              try {
                const techResponse = await technicienService.getTechnicien(
                  item.technicien
                );
                technicienData = techResponse.data;
              } catch (error) {
                console.error("Error fetching technicien data:", error);
              }
            } else {
              technicienData = item.technicien;
            }

            // Fetch demandeur data
            if (item.demandeur && !item.demandeur.user) {
              try {
                const demandeurResponse = await demandeurService.getDemandeur(
                  item.demandeur
                );
                demandeurData = demandeurResponse.data;
              } catch (error) {
                console.error("Error fetching demandeur data:", error);
              }
            } else {
              demandeurData = item.demandeur;
            }

            return {
              ...item,
              id: item.interCode,
              technicienData: technicienData,
              demandeurData: demandeurData,
            };
          })
        );
        setDataRows(updatedDataRows);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleViewDetails = (ticketId) => {
    console.log(`Affichage des détails du ticket avec l'ID : ${ticketId}`);
    ticketService
      .getTicket(ticketId)
      .then((response) => {
        setSelectedTicket(response.data);
        setOpenDetailsDialog(true);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const navigate = useNavigate();
  const handleUpdate = async (interCode) => {
    try {
      const response = await ticketService.getTicket(interCode);
      const ticketData = response.data;
      console.log(response.data);
      // Passez les données du ticket à la page suivante via l'URL
      navigate(
        `/manager/creer-intervention?ticketData=${JSON.stringify(ticketData)}`
      );
    } catch (error) {
      console.error("Error fetching ticket data:", error);
    }
  };

  

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
  };

  const [total, setTotal] = useState(0);
  const [enAttente, setEnAttente] = useState(0);
  const [aRealiser, setARealiser] = useState(0);
  const [realise, setRealise] = useState(0);

  const loadTicketToltal = async () => {
    try {
      const response = await ticketService.getAllTickets();
      setTotal(response.data.length); // Assurez-vous que response.data est un tableau pour obtenir sa longueur
    } catch (error) {
      console.error("Error fetching total ticket data:", error);
    }
  };
  
  const loadEnAttenteTicket = async () => {
    try {
      const response = await ticketService.getAllTickets(); // Vous pouvez ajouter un filtre ici pour les tickets en attente si nécessaire
      const enAttenteCount = response.data.filter(ticket => ticket.interStatut === "En attente").length;
      setEnAttente(enAttenteCount);
    } catch (error) {
      console.error("Error fetching en attente ticket data:", error);
    }
  };
  
  const loadTicketRealise = async () => {
    try {
      const response = await ticketService.getAllTickets();
      const realiseCount = response.data.filter(ticket => ticket.interStatut === "Réalisé").length;
      setRealise(realiseCount);
    } catch (error) {
      console.error("Error fetching realise ticket data:", error);
    }
  };
  
  const loadTicketARealise = async () => {
    try {
      const response = await ticketService.getAllTickets();
      const aRealiserCount = response.data.filter(ticket => ticket.interStatut === "A réaliser").length;
      setARealiser(aRealiserCount);
    } catch (error) {
      console.error("Error fetching a realiser ticket data:", error);
    }
  };
  

  useEffect(() => {
    loadTicketToltal();
    loadEnAttenteTicket();
    loadTicketARealise();
    loadTicketRealise();
  }, []);

  const [clientFilter, setClientFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleClientFilterChange = (event) => {
    setClientFilter(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const clearClientFilter = () => {
    setClientFilter("");
  };

  const clearStatusFilter = () => {
    setStatusFilter("");
  };

  const filteredRows = dataRows.filter(
    (row) =>
      (clientFilter === "" ||
        row.demandeurData.client?.nomSociete === clientFilter) &&
      (statusFilter === "" || row.interStatut === statusFilter)
  );

  const columns = [
    {
      field: "interCode",
      headerName: "ID",
      //flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "client",
      headerName: "Société",
      flex: 1,
      headerAlign: "center",
      renderCell: ({ row }) => {
        const { demandeurData } = row;
        return (
          <Typography>
            {demandeurData && demandeurData.client
              ? demandeurData.client.nomSociete
              : "-"}
          </Typography>
        );
      },
    },
    {
      field: "demandeur",
      headerName: "Demandeur",
      flex: 1,
      headerAlign: "center",
      renderCell: ({ row }) => {
        const { demandeurData } = row;
        console.log(demandeurData, "0000000");
        if (demandeurData && demandeurData.user && demandeurData.user.image) {
          return (
            <Box display="flex" alignItems="center">
              <Avatar
                src={`data:image/png;base64,${demandeurData.user.image.image}`}
                alt={`${demandeurData.user.prenom} ${demandeurData.user.nom}`}
                sx={{ width: 24, height: 24, marginRight: 1 }}
              />
              <Typography>
                {demandeurData.user.prenom} {demandeurData.user.nom}
              </Typography>
            </Box>
          );
        } else if (demandeurData && demandeurData.user) {
          return (
            <Box display="flex" alignItems="center">
              <Avatar
                src={`data:image/png;base64,${demandeurData.user.image}`}
                alt={`${demandeurData.user.prenom} ${demandeurData.user.nom}`}
                sx={{ width: 24, height: 24, marginRight: 1 }}
              />
              <Typography>
                {demandeurData.user.prenom} {demandeurData.user.nom}
              </Typography>
            </Box>
          );
        } else {
          return <Typography>Aucun Demandeur</Typography>;
        }
      },
    },
    {
      field: "technicien",
      headerName: "Technicien",
      flex: 1,
      headerAlign: "center",
      renderCell: ({ row }) => {
        const { technicienData } = row;
        console.log(technicienData, "0000000");
        if (
          technicienData &&
          technicienData.user &&
          technicienData.user.image
        ) {
          return (
            <Box display="flex" alignItems="center">
              <Avatar
                src={`data:image/png;base64,${technicienData.user.image.image}`}
                alt={`${technicienData.user.prenom} ${technicienData.user.nom}`}
                sx={{ width: 24, height: 24, marginRight: 1 }}
              />
              <Typography>
                {technicienData.user.prenom} {technicienData.user.nom}
              </Typography>
            </Box>
          );
        } else if (technicienData && technicienData.user) {
          return (
            <Box display="flex" alignItems="center">
              <Avatar
                src={`data:image/png;base64,${technicienData.user.image}`}
                alt={`${technicienData.user.prenom} ${technicienData.user.nom}`}
                sx={{ width: 24, height: 24, marginRight: 1 }}
              />
              <Typography>
                {technicienData.user.prenom} {technicienData.user.nom}
              </Typography>
            </Box>
          );
        } else {
          return <Typography>Aucun technicien</Typography>;
        }
      },
    },
    // {
    //   field: "interDesignation",
    //   headerName: "Designation",
    //   flex: 2,
    //   headerAlign: "center",
    //   align: "center",
    // },
    // {
    //   field: "interventionNature.libelle",
    //   headerName: "Nature",
    //   align: "center",
    //   headerAlign: "center",
    //   valueGetter: (params) =>
    //     params.row.interventionNature
    //       ? params.row.interventionNature.libelle
    //       : "",
    // },
    {
      field: "interPriorite",
      headerName: "Priorité",
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => {
        // Correctement déstructurer l'objet row
        const { interPriorite } = row; // Accéder directement à la propriété interPriorite
        return (
          <Box
            sx={{
              p: "5px",
              width: "99px",
              borderRadius: "3px",
              textAlign: "center",
              display: "flex",
              justifyContent: "space-evenly",
              backgroundColor:
                interPriorite === "Haute"
                  ? theme.palette.mode === "light"
                    ? "#fee2e2"
                    : "#ffc1cc"
                  : interPriorite === "Moyenne"
                  ? theme.palette.mode === "light"
                    ? "#f6ffc2"
                    : "#f1fc8c"
                  : "#e0fec9",
            }}
          >
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: "bold",
                color:
                  interPriorite === "Haute"
                    ? theme.palette.mode === "light"
                      ? "#ff0000" // Rouge pour priorité haute
                      : "#ff0000"
                    : interPriorite === "Moyenne"
                    ? theme.palette.mode === "light"
                      ? "#f19d0f" // Jaune pour priorité moyenne
                      : "#c58d09"
                    : "#008000", // Vert pour les autres priorités
              }}
            >
              {interPriorite}
            </Typography>
          </Box>
        );
      },
    },
    // {
    //   field: "dateCreation",
    //   headerName: "Date de création",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    //   valueFormatter: (params) => {
    //     const date = new Date(params.value);
    //     const options = { day: "2-digit", month: "short", year: "numeric" };
    //     const formattedDate = new Intl.DateTimeFormat("fr-FR", options).format(
    //       date
    //     );
    //     return formattedDate;
    //   },
    // },
    {
      field: "datePrevue",
      headerName: "Date prévue",
      //flex: 1,
      align: "center",
      headerAlign: "center",
      valueFormatter: (params) => {
        const date = new Date(params.value);
        const options = { day: "2-digit", month: "short", year: "numeric" };
        const formattedDate = new Intl.DateTimeFormat("fr-FR", options).format(
          date
        );
        if (params.value) {
          return formattedDate;
        } else return "-";
      },
    },
    {
      field: "dateCloture",
      headerName: "Date de cloture",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <span>
          {row.intervention ? (
            <>
              {row.intervention.dateCloture
                ? new Date(row.intervention.dateCloture).toLocaleString(
                    "fr-FR",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                : "-"}
            </>
          ) : (
            "-"
          )}
        </span>
      ),
    },
    {
      field: "interStatut",
      headerName: "Statut",
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => {
        // Correctement déstructurer l'objet row
        const { interStatut } = row; // Accéder directement à la propriété interPriorite
        return (
          <Box
            sx={{
              p: "5px",
              width: "99px",
              borderRadius: "3px",
              textAlign: "center",
              display: "flex",
              justifyContent: "space-evenly",
              backgroundColor:
                interStatut === "En attente"
                  ? theme.palette.mode === "light"
                    ? "#f16609"
                    : "#f16609"
                  : interStatut === "A réaliser"
                  ? theme.palette.mode === "light"
                    ? "#e4b60e"
                    : "#f4ce1b"
                  : interStatut === "Annulé"
                  ? theme.palette.mode === "light"
                    ? "#cf0606"
                    : "#f10909"
                  : interStatut === "Réalisé"
                  ? theme.palette.mode === "light"
                    ? "#0aae02"
                    : "#0aae02"
                  : "#e63d3d",
            }}
          >
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              {interStatut}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "", // Nouvelle colonne pour les actions
      headerName: "Action", // Vous pouvez laisser vide si vous ne voulez pas de texte dans l'en-tête
      align: "center",

      headerAlign: "center",
      renderCell: ({ row }) => (
        <>
          <RemoveRedEyeOutlined
            sx={{ color: "#918bc7", mr: "7px" }}
            onClick={() => handleViewDetails(row.interCode)}
            style={{ cursor: "pointer" }}
          />

          <EditNote
            sx={{ color: "#438e96", mr: "7px", cursor: "pointer" }}
            onClick={() => handleUpdate(row.interCode)}
          />
        </>
      ),
    },
  ];

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
          //marginBottom: 2,
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
          Intervention
        </Typography>
      </Box>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "background.default",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              height: 100,
            }}
          >
            <Box>
              <Typography fontSize={15} fontWeight="bold">
                Total des interventions
              </Typography>
              <Typography variant="h4">{total}</Typography>
            </Box>
            <CircleIcon />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "background.default",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              height: 100,
            }}
          >
            <Box>
              <Typography fontSize={15} fontWeight="bold">
                Interventions en attente
              </Typography>
              <Typography variant="h4">{enAttente}</Typography>
            </Box>
            <CircleIcon />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "background.default",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              height: 100,
            }}
          >
            <Box>
              <Typography fontSize={15} fontWeight="bold">
                Interventions à réaliser
              </Typography>
              <Typography variant="h4">{aRealiser}</Typography>
            </Box>
            <CircleIcon />
          </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "background.default",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              height: 100,
            }}
          >
            <Box>
              <Typography fontSize={15} fontWeight="bold">
                Interventions réalisées
              </Typography>
              <Typography variant="h4">{realise}</Typography>
            </Box>
            <CircleIcon />
          </Box>
        </Grid>
      </Grid>
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
              <ConfirmationNumberOutlined />
              Interventions
              <Box sx={{ display: "flex", gap: "16px", marginLeft: "auto" }}>
                <FormControl variant="outlined" sx={{ minWidth: 250 }}>
                  <InputLabel size="small">Société</InputLabel>
                  <Select
                    value={clientFilter}
                    onChange={handleClientFilterChange}
                    label="Société"
                    size="small"
                    endAdornment={
                      clientFilter && (
                        <InputAdornment position="end">
                          <IconButton onClick={clearClientFilter}>
                            <Clear />
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  >
                    {/* <MenuItem value="">Tous</MenuItem> */}
                    {Array.from(
                      new Set(
                        dataRows.map((row) => row.demandeurData?.client?.nomSociete)
                      )
                    )
                      .filter(Boolean)
                      .map((client) => (
                        <MenuItem key={client} value={client}>
                          {client}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <FormControl variant="outlined" sx={{ minWidth: 250 }}>
                  <InputLabel size="small">Statut</InputLabel>
                  <Select
                    value={statusFilter}
                    size="small"
                    onChange={handleStatusFilterChange}
                    label="Statut"
                    endAdornment={
                      statusFilter && (
                        <InputAdornment position="end">
                          <IconButton onClick={clearStatusFilter}>
                            <Clear />
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  >
                    {/* <MenuItem value="">Tous</MenuItem> */}
                    {Array.from(new Set(dataRows.map((row) => row.interStatut)))
                      .filter(Boolean)
                      .map((statut) => (
                        <MenuItem key={statut} value={statut}>
                          {statut}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          }
          subTitle=""
        />
        <Box sx={{ height: 600, mx: "auto" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            getRowId={(row) => row.interCode}
          />
        </Box>
      </Box>
      <Dialog
        open={openDetailsDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDetailsDialog}
        aria-labelledby="ticket-details-dialog"
      >
        <DialogTitle id="ticket-details-dialog">Détails du Ticket</DialogTitle>
        <DialogContent>
          {selectedTicket && (
            <TableContainer style={{ minWidth: "400px" }}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <strong>InterCode:</strong>
                    </TableCell>
                    <TableCell>{selectedTicket.interCode}</TableCell>
                    <TableCell>
                      <strong>Description panne:</strong>
                    </TableCell>
                    <TableCell>
                      {selectedTicket.intervention.descriptionPanne}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Designation:</strong>
                    </TableCell>
                    <TableCell>{selectedTicket.interDesignation}</TableCell>
                    <TableCell>
                      <strong>Technicien:</strong>
                    </TableCell>
                    <TableCell>
                      {`${selectedTicket.technicien.user.nom} ${selectedTicket.technicien.user.prenom}`}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                     
                    <strong>Description:</strong>
                  </TableCell>
                  <TableCell>{selectedTicket.description}</TableCell>
                  <TableCell>
                    <strong>Compte rendu:</strong>
                  </TableCell>
                  <TableCell>
                    {selectedTicket.intervention.compteRendu}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Nature:</strong>
                  </TableCell>
                  <TableCell>
                    {selectedTicket.interventionNature.libelle}
                  </TableCell>
                  <TableCell>
                    <strong>Date Création:</strong>
                  </TableCell>
                  <TableCell>
                    {format(
                      selectedTicket.dateCreation,
                      "dd, MMMM, yyyy HH:mm"
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Type:</strong>
                  </TableCell>
                  <TableCell>
                    {selectedTicket.intervention.interventionType
                      ?.libelleType ?? ""}
                  </TableCell>
                  <TableCell>
                    <strong>Cause:</strong>
                  </TableCell>
                  <TableCell>
                    {selectedTicket.intervention.cause?.libelle ?? ""}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Machine arrêtée:</strong>
                  </TableCell>
                  <TableCell>
                    {selectedTicket.machineArret === "Oui" ? "Oui" : "Non"}
                  </TableCell>
                  <TableCell>
                    <strong>Observation:</strong>
                  </TableCell>
                  <TableCell>
                    {selectedTicket.intervention.interventionObservation}
                  </TableCell>
                </TableRow>
                {selectedTicket.machineArret === "Oui" && (
                  <>
                    <TableRow>
                      <TableCell>
                        <strong>Date d'arrêt:</strong>
                      </TableCell>
                      <TableCell>
                        {format(
                          selectedTicket.dateArret,
                          "dd, MMMM, yyyy HH:mm"
                        )}
                      </TableCell>
                      <TableCell>
                        <strong>Durée d'arrêt:</strong>
                      </TableCell>
                      <TableCell>{selectedTicket.dureeArret}</TableCell>
                    </TableRow>
                  </>
                )}
                <TableRow>
                  <TableCell>
                    <strong>Deplacement:</strong>
                  </TableCell>
                  <TableCell>
                    {selectedTicket.intervention.interMtDeplacement}
                  </TableCell>
                  <TableCell>
                    <strong>Hebergement:</strong>
                  </TableCell>
                  <TableCell>
                    {selectedTicket.intervention.interMtHebergement}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Date prévue:</strong>
                  </TableCell>
                  <TableCell>
                    {selectedTicket.intervention.datePrevue
                      ? format(
                          selectedTicket.datePrevue,
                          "dd, MMMM, yyyy HH:mm"
                        )
                      : ""}
                  </TableCell>
                  <TableCell>
                    <strong>Durée prévue:</strong>
                  </TableCell>
                  <TableCell>{selectedTicket.dureePrevue}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Date de réalisation:</strong>
                  </TableCell>
                  <TableCell>
                    {selectedTicket.intervention.dtRealisation
                      ? format(
                          selectedTicket.intervention.dtRealisation,
                          "dd, MMMM, yyyy HH:mm"
                        )
                      : ""}
                  </TableCell>
                  <TableCell>
                    <strong>Durée de réalisation:</strong>
                  </TableCell>
                  <TableCell>
                    {selectedTicket.intervention.dureeRealisation}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDetailsDialog} color="primary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  </Box>
);
  
};

export default Intervention;
