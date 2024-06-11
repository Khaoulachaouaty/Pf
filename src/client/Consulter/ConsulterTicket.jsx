import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  InputAdornment,
  Avatar,
} from "@mui/material";
import { Box } from "@mui/material";
import { Delete, RemoveRedEyeOutlined, Clear } from "@mui/icons-material";
import Header from "../../admin/components/Header";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { ticketService } from "../../services/ticke_servicet";
import { ConfirmationNumberOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import Slide from "@mui/material/Slide";
import { format } from "date-fns";
import { technicienService } from "../../services/technicien_service";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Ticket = () => {
  const theme = useTheme();

  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [dataRows, setDataRows] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const [equipmentFilter, setEquipmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ticketService.getTicketDemandeur();
        const ticketData = response.data;
        console.log(response.data,'***')
        // Fetch technicien data for each ticket
        const updatedDataRows = await Promise.all(
          ticketData.map(async (item) => {
            let technicienData = null;
            if (!item.technicien){
              return { ...item, id: item.interCode, technicienData: "-" };            }
            else if (item.technicien.user){
              technicienData = item.technicien;
            }
            else if (item.technicien) {
              try {
                const techResponse = await technicienService.getTechnicien(item.technicien);
                technicienData = techResponse.data;
              } catch (error) {
                console.error("Error fetching technicien data:", error);
              }
            }
            return {
              ...item,
              id: item.interCode,
              technicienData: technicienData,
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

  const handleDeleteRow = (rowId) => {
    const ticketToDelete = dataRows.find(
      (ticket) => ticket.interCode === rowId
    );
    if (ticketToDelete) {
      setSelectedRowId(ticketToDelete.interCode);
      setOpenConfirmationDialog(true);
    } else {
      console.error("Ticket not found with ID:", rowId);
    }
  };

  const handleConfirmDelete = () => {
    if (!selectedRowId) {
      console.error("No ticket selected for deletion.");
      return;
    }

    ticketService
      .deleteTicket(selectedRowId)
      .then((response) => {
        console.log("Ticket deleted from database:", response.data);
        const updatedRows = dataRows.filter(
          (ticket) => ticket.interCode !== selectedRowId
        );
        setDataRows(updatedRows);
        console.log("Ticket deleted successfully.");
      })
      .catch((error) => {
        console.error("Error deleting ticket from database:", error);
      });

    setOpenConfirmationDialog(false);
  };

  const handleCloseConfirmationDialog = () => {
    setOpenConfirmationDialog(false);
  };

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

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
  };

  const handleEquipmentFilterChange = (event) => {
    setEquipmentFilter(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const clearEquipmentFilter = () => {
    setEquipmentFilter("");
  };

  const clearStatusFilter = () => {
    setStatusFilter("");
  };

  const filteredRows = dataRows.filter(
    (row) =>
      (equipmentFilter === "" ||
        row.equipement?.eqptDesignation === equipmentFilter) &&
      (statusFilter === "" || row.interStatut === statusFilter)
  );

  const columns = [
    {
      field: "interCode",
      headerName: "ID",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "interDesignation",
      headerName: "Designation",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "technicien",
      headerName: "Technicien",
      flex: 1,
      headerAlign: "center",
      renderCell: ({ row }) => {
        const { technicienData } = row;
        console.log(technicienData,"0000000")
        if (technicienData && technicienData.user && technicienData.user.image) {
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
        } 
        else if (technicienData && technicienData.user){
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
        }
        else {
          return <Typography>Aucun technicien</Typography>;
        }
      },
    },
    {
      field: "equipement",
      headerName: "Equipement",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) =>
        params.row.equipement ? params.row.equipement.eqptDesignation : "",
    },
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
              borderRadius: "20px",
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
    {
      field: "dateCreation",
      headerName: "Date de création",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueFormatter: (params) => {
        const date = new Date(params.value);
        const options = { day: "2-digit", month: "short", year: "numeric" };
        const formattedDate = new Intl.DateTimeFormat("fr-FR", options).format(
          date
        );
        return formattedDate;
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
              borderRadius: "20px",
              textAlign: "center",
              display: "flex",
              justifyContent: "space-evenly",
              backgroundColor:
                interStatut === "En attente"
                  ? theme.palette.mode === "light"
                    ? "#FF9800" // Orange
                    : "#FFB74D" // Orange
                  : interStatut === "A réaliser"
                  ? theme.palette.mode === "light"
                    ? "#3597a5"
                    : "#53b4c1"
                  : interStatut === "Annulé"
                  ? theme.palette.mode === "light"
                    ? "#F44336" // Rouge
                    : "#EF5350" // Rouge
                  : interStatut === "Réalisé"
                  ? theme.palette.mode === "light"
                    ? "#4CAF50" // Vert
                    : "#81C784" // Vert
                  : interStatut === "Bloqué"
                  ? theme.palette.mode === "light"
                    ? "#d55421"
                    : "#e6783d"
                  : "#FFFFFF", // Blanc par défaut
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
            sx={{
              color: theme.palette.mode === "light" ? "#607D8B" : "#90A4AE",
              mr: "10px",
            }} // Bleu gris
            onClick={() => handleViewDetails(row.interCode)}
            style={{ cursor: "pointer" }}
          />

          <Delete
            sx={{
              color: theme.palette.mode === "light" ? "#E53935" : "#EF9A9A",
            }} // Rouge
            onClick={() => handleDeleteRow(row.interCode)}
            style={{ cursor: "pointer", marginRight: 8 }}
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
        sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}
      >
        <Button
          component={Link}
          to="/client/creer-ticket"
          variant="outlined"
          sx={{
            color:
              theme.palette.mode === "light"
                ? theme.palette.primary.main
                : theme.palette.primary.main,

            borderColor:
              theme.palette.mode === "light"
                ? theme.palette.primary.main
                : theme.palette.primary.main,

            "&:hover": {
              color:
                theme.palette.mode === "light"
                  ? theme.palette.secondary.main
                  : theme.palette.secondary.main,
              borderColor:
                theme.palette.mode === "light"
                  ? theme.palette.secondary.main
                  : theme.palette.secondary.main,
            },
            marginLeft: "auto",
          }}
        >
          Ajouter
        </Button>
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
              Tickets
              <Box sx={{ display: "flex", gap: "16px", marginLeft: "auto" }}>
                <FormControl variant="outlined" sx={{ minWidth: 250 }}>
                  <InputLabel size="small">Equipement</InputLabel>
                  <Select
                    value={equipmentFilter}
                    onChange={handleEquipmentFilterChange}
                    label="Equipement"
                    size="small"
                    endAdornment={
                      equipmentFilter && (
                        <InputAdornment position="end">
                          <IconButton onClick={clearEquipmentFilter}>
                            <Clear />
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  >
                    {/* <MenuItem value="">Tous</MenuItem> */}
                    {Array.from(
                      new Set(
                        dataRows.map((row) => row.equipement?.eqptDesignation)
                      )
                    )
                      .filter(Boolean)
                      .map((equipement) => (
                        <MenuItem key={equipement} value={equipement}>
                          {equipement}
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
        open={openConfirmationDialog}
        onClose={handleCloseConfirmationDialog}
      >
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cet élément ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
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
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>InterDesignation:</strong>
                    </TableCell>
                    <TableCell>{selectedTicket.interDesignation}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Description:</strong>
                    </TableCell>
                    <TableCell>{selectedTicket.description}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Nature:</strong>
                    </TableCell>
                    <TableCell>
                      {selectedTicket.interventionNature.libelle}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Machine arrêtée:</strong>
                    </TableCell>
                    <TableCell>
                      {selectedTicket.machineArret === "Oui" ? "Oui" : "Non"}
                    </TableCell>
                  </TableRow>
                  {selectedTicket.machineArret === "Oui" && (
                    <>
                      <TableRow>
                        <TableCell>
                          <strong>Durée d'arrêt:</strong>
                        </TableCell>
                        <TableCell>{selectedTicket.dureeArret}</TableCell>
                      </TableRow>
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
                      </TableRow>
                    </>
                  )}
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

export default Ticket;
