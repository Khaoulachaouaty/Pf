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
  TextField,
  Autocomplete,
} from "@mui/material";
import { formatDate } from "@fullcalendar/core";
import "./calendar.css";
import { ticketService } from "../../services/ticke_servicet"; // Assurez-vous d'importer votre service de ticket
import { useNavigate } from "react-router-dom";

const Calendar = () => {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventsFromBackend = async () => {
      try {
        const response = await ticketService.getAllTickets();
        if (!response.data) {
          throw new Error("Erreur lors de la récupération des événements");
        }
        console.log(response.data);
        const eventData = response.data.map((event) => ({
          id: event.interCode, // Utilisez l'id comme identifiant d'événement
          title: `${event.interCode} - ${event.equipement.eqptDesignation}`,
          start: getEventStartDate(event),
          end: getEventEndDate(event),
          demandeur:
            event.demandeur &&
            event.demandeur.client &&
            event.demandeur.client.nomSociete,
          technicien:
            event.technicien &&
            event.technicien.user &&
            `${event.technicien.user.nom} ${event.technicien.user.prenom}`,
          statut: event.interStatut,
        }));
        setCurrentEvents(eventData);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchEventsFromBackend();
  }, []);

  const handleEventClick = async (clickInfo) => {
    const ticketId = clickInfo.event.id; // Supposons que l'ID du ticket est l'ID de l'événement
    try {
      const ticketData = await ticketService.getTicket(ticketId);
      navigate(`/manager/creer-intervention?ticketData=${JSON.stringify(ticketData.data)}`);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du ticket:", error);
      // Gérer les erreurs de récupération du ticket, par exemple, afficher un message à l'utilisateur
    }
  };

  // Fonction pour déterminer la date de début de l'événement en fonction du statut de l'intervention
  const getEventStartDate = (event) => {
    if (event.interStatut === "Réalisé") {
      return event.intervention.dtRealisation;
    } else if (
      event.interStatut === "En attente" ||
      event.interStatut === "Annulé" ||
      event.interStatut === "Bloqué"
    ) {
      return event.dateCreation;
    } else if (event.interStatut === "A réaliser"){
      return event.datePrevue;
    }
  };

  // Fonction pour déterminer la date de fin de l'événement en fonction du statut de l'intervention
  const getEventEndDate = (event) => {
    if (event.interStatut === "Réalisé") {
      return event.intervention.dtRealisation;
    } else if (
      event.interStatut === "En attente" ||
      event.interStatut === "Annulé" ||
      event.interStatut === "Bloqué"
    ) {
      return event.dateCreation;
    } else if (event.interStatut === "A réaliser"){
      return event.datePrevue;
    }
  };

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
      designation:selectInfo.interDesignation,
      demandeur: selectInfo.demandeur
        ? selectInfo.demandeur.client.nomSociete
        : null, // Vérifiez si demandeur est défini
      technicien: selectInfo.technicien
        ? `${selectInfo.technicien.user.nom} ${selectInfo.technicien.user.prenom}`
        : null, // Concaténer nom et prénom du technicien
    });
    setIsEditing(false); // Définit le mode d'édition à false (nouvel événement)
  };
  // Fonction pour gérer le clic sur un événement existant dans le calendrier
  // const handleEventClick = (clickInfo) => {
  //   setOpenDialog(true); // Ouvre le dialog
  //   setSelectedEvent(clickInfo.event); // Définit l'événement sélectionné
  //   setIsEditing(true); // Définit le mode d'édition à true (modification d'événement)
  // };

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
      backgroundColor = "#3a7f3b"; // Fond vert pour les événements réalisés
    } else if (eventInfo.event.extendedProps.statut === "A réaliser") {
      backgroundColor = "#cecc4d"; // Fond jaune pour les événements à réaliser
    } else if (eventInfo.event.extendedProps.statut === "En attente") {
      backgroundColor = "#dc6b2e";
    } else if (eventInfo.event.extendedProps.statut === "Bloqué") {
      backgroundColor = "#d3a096";
    } else if (eventInfo.event.extendedProps.statut === "Annulé") {
      backgroundColor = "#cd3535";
    }

    let eventStyle = {
      backgroundColor: backgroundColor,
      color: "#faf6ee",
      borderRadius: "10px",
      padding: "5px 10px",
      width: "100%",
      borderColor: "#000000", // Vous pouvez ajouter une couleur de bordure si nécessaire
    };

    return (
      <>
        <div style={eventStyle}>{eventInfo.event.title}</div>
        {/* Affichage de la désignation */}
      </>
    );
  }

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
  } else if (filter === "bloque") {
    filteredEvents = currentEvents.filter((event) => event.statut === "Bloqué");
  } else if (filter === "annule") {
    filteredEvents = currentEvents.filter((event) => event.statut === "Annulé");
  } else if (filter === "enAttente") {
    filteredEvents = currentEvents.filter(
      (event) => event.statut === "En attente"
    );
  }

  const filterOptions = [
    { label: "Tous", value: "all" },
    { label: "Réalisé", value: "realise" },
    { label: "A réaliser", value: "aRealiser" },
    { label: "Bloqué", value: "bloque" },
    { label: "Annuler", value: "annule" },
    { label: "En attente", value: "enAttente" },
  ];

  // Fonction de rendu pour un événement dans la barre latérale
  const renderSidebarEvent = (event) => {
    return (
      <li key={event.id} style={{ margin: 10, fontSize:14 }}>
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

  const handleEventDrop = async (eventDropInfo) => {
    const { event, oldEvent } = eventDropInfo;
    const eventId = event.id;
    const newDatePrevue = event.start.toISOString();
    console.log(newDatePrevue);
    try {
      // Appel de la route backend pour mettre à jour la date prévue de l'événement
      await ticketService.updateEventDate(eventId, newDatePrevue);

      // Mettre à jour l'événement dans l'état local (si nécessaire)
      const updatedEvents = currentEvents.map((e) => {
        if (e.id === eventId) {
          return { ...e, start: newDatePrevue, end: newDatePrevue };
        }
        return e;
      });
      setCurrentEvents(updatedEvents);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'événement:", error);
      // Gérer les erreurs de mise à jour de la base de données
    }
  };

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
        autoSelect // Sélectionne automatiquement la première option
        renderInput={(params) => (
          <TextField {...params} label="Filtrer" variant="outlined" />
        )}
        style={{ margin: "auto", width: "20%" }} // Ajustez la largeur selon vos besoins
        freeSolo={false} // Empêche l'utilisateur d'entrer du texte
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
            eventDrop={handleEventDrop}
            events={filteredEvents} // Utilisez filteredEvents pour afficher les événements filtrés dans le calendrier
          />
        </div>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{"Détails d'événement"}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <Typography variant="body1">
                  <b>Designation :</b>
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {selectedEvent ? selectedEvent.designation : ""}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1">
                  <b>Nom de client :</b>
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {selectedEvent ? selectedEvent.extendedProps.demandeur : ""}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1">
                  <b>Nom de technicien :</b>
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {selectedEvent ? selectedEvent.extendedProps.technicien : ""}
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Fermer</Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </>
  );
};

export default Calendar;
