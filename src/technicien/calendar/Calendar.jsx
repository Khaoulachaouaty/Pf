import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Autocomplete,
  TextField,
} from "@mui/material";
import { formatDate } from "@fullcalendar/core";
import "./calendar.css";
import { ticketService } from "../../services/ticke_servicet"; // Assurez-vous d'importer votre service de ticket

const Calendar = () => {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchEventsFromBackend = async () => {
      try {
        const response = await ticketService.getTicketTech();
        if (!response.data) {
          throw new Error("Erreur lors de la récupération des événements");
        }
        console.log(response.data);
        const eventData = response.data.map((event) => ({
          id: event.interCode, // Utilisez l'id comme identifiant d'événement
          title: event.interDesignation, // Utilisez la désignation comme titre d'événement
          start: event.interStatut === "Réalisé" ? event.intervention.dtRealisation : event.datePrevue, // Utilisez dtRealisation si le statut est Réalisé, sinon utilisez datePrevue
          end: event.interStatut === "Réalisé" ? event.intervention.dtRealisation : event.datePrevue, // Utilisez la date prévue comme date de fin de l'événement
          demandeur:
            event.demandeur &&
            event.demandeur.client &&
            event.demandeur.client.nomSociete,
          statut: event.interStatut,
        }));
        setCurrentEvents(eventData);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchEventsFromBackend();
  }, []);

  const handleDateSelect = (selectInfo) => {
    if (!selectInfo.hasEvent) {
      // Vérifie si la date sélectionnée n'a pas d'événement
      return; // Ne fait rien si la date sélectionnée n'a pas d'événement
    }

    setOpenDialog(true); // Ouvre le dialog
    setSelectedEvent({
      // Initialise les détails de l'événement sélectionné
      id: createEventId(),
      title: "",
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
      demandeur: selectInfo.demandeur
        ? selectInfo.demandeur.client.nomSociete
        : null, // Vérifiez si demandeur est défini
    });
    setIsEditing(false); // Définit le mode d'édition à false (nouvel événement)
  };
  // Fonction pour gérer le clic sur un événement existant dans le calendrier
  const handleEventClick = (clickInfo) => {
    setOpenDialog(true); // Ouvre le dialog
    setSelectedEvent(clickInfo.event); // Définit l'événement sélectionné
    setIsEditing(true); // Définit le mode d'édition à true (modification d'événement)
  };

  // Fonction pour fermer le dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null); // Réinitialise l'événement sélectionné à null
  };

  // Fonction utilitaire pour créer un identifiant unique d'événement
  const createEventId = () => {
    return String(Date.now());
  };

  function renderEventContent(eventInfo) {
    let backgroundColor = "#b3cbe4"; // Couleur de fond par défaut
    console.log(eventInfo.event.extendedProps.statut);

    if (eventInfo.event.extendedProps.statut === "Réalisé") {
      backgroundColor = "lightgreen"; // Fond vert pour les événements réalisés
    } else if (eventInfo.event.extendedProps.statut === "A réaliser") {
      backgroundColor = "yellow"; // Fond jaune pour les événements à réaliser
    }

    let eventStyle = {
      backgroundColor: backgroundColor,
      color: "#000000",
      borderRadius: "10px",
      padding: "5px 10px",
      width: "100%",
      borderColor: "#000000", // Vous pouvez ajouter une couleur de bordure si nécessaire
    };

    return (
      <>
        <div style={eventStyle}>{eventInfo.event.title}</div>{" "}
        {/* Affichage de la désignation */}
      </>
    );
  }

  // Fonction de rendu pour un événement dans la barre latérale
  const renderSidebarEvent = (event) => {
    return (
      <li key={event.id} style={{ margin: 10 }}>
        <b>{event.title}</b> {/* Affichage du titre de l'événement */}
        <i>
          {formatDate(event.start, {
            // Formatage de la date de début de l'événement
            year: "numeric",
            month: "short",
            day: "numeric",
            locale: "fr-FR",
          })}
        </i>
      </li>
    );
  };

  // Ajoutez ces états pour suivre le filtre sélectionné
  const [filter, setFilter] = useState("all");

  // Gestionnaire d'événement pour le changement de filtre
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  // Filtrer les événements en fonction du filtre sélectionné
  let filteredEvents = currentEvents;
  if (filter === "realise") {
    filteredEvents = currentEvents.filter(
      (event) => event.statut === "Réalisé"
    );
  } else if (filter === "aRealiser") {
    filteredEvents = currentEvents.filter(
      (event) => event.statut === "A réaliser"
    );
  }

  const filterOptions = [
    { label: "Tous", value: "all" },
    { label: "Réalisé", value: "realise" },
    { label: "A réaliser", value: "aRealiser" },
  ];
  return (
    <>
      <Autocomplete
        options={filterOptions}
        size="small"
        getOptionLabel={(option) => option.label}
        value={filterOptions.find((option) => option.value === filter)}
        onChange={(event, newValue) => {
          if (newValue) {
            handleFilterChange(newValue.value);
          }
        }}
        renderInput={(params) => (
          <TextField {...params} label="Filtrer" variant="outlined" />
        )}
        style={{ margin: "auto", width: "20%" }} // Ajustez la largeur selon vos besoins
      />

      <Stack direction={"row"}>
        <Paper className="demo-app-sidebar">
          <h2 style={{ textAlign: "center", margin: 10, marginTop: 20 }}>
            Tous les événements ({currentEvents.length})
          </h2>
          <ul>{currentEvents.map(renderSidebarEvent)}</ul>
        </Paper>
        <div className="demo-app-main">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="dayGridMonth" //Vue initiale du calendrier
            editable={true} // Activation de la modification des événements dans le calendrier
            selectable={true} // Activation de la sélection de dates dans le calendrier
            selectMirror={true} // Affichage d'un mirroir lors de la sélection
            dayMaxEvents={true}
            select={handleDateSelect} // Gestionnaire de sélection de date
            eventClick={handleEventClick} // Gestionnaire de clic sur un événement
            eventClassNames="custom-event" // Ajoutez la classe CSS personnalisée à vos événements
            eventContent={renderEventContent} // Utilisation de la fonction renderEventContent
            events={filteredEvents} // Utilisez filteredEvents pour afficher les événements filtrés dans le calendrier
          />
        </div>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{"Détails d'événement"}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <Typography variant="body1">
                  <b>Designation :</b>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  {selectedEvent ? selectedEvent.title : ""}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  <b>Nom de client :</b>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  {selectedEvent ? selectedEvent.extendedProps.demandeur : ""}
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </>
  );
};

export default Calendar;
