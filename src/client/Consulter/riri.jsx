import React from "react";
import { useLocation } from "react-router-dom";
import { Container, Typography, Grid, Paper } from "@mui/material";

const TicketDetails = () => (
  <Grid item xs={12} sm={6} md={4}>
    <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
      <Typography variant="subtitle1" gutterBottom>
        {}
      </Typography>
      <Typography variant="body1">{}</Typography>
    </Paper>
  </Grid>
);

const Riri = () => {
  const location = useLocation();

  return (
    <Container maxWidth="lg" style={{ marginTop: 20 }}>
      <Typography variant="h4" gutterBottom>
        Détails du Ticket
      </Typography>
      <Grid container spacing={3}>
        <TicketDetails label="Code" />
        <TicketDetails label="Désignation" />
        <TicketDetails label="Description"  />
        <TicketDetails label="Date prévue" />
        <TicketDetails label="Heure prévue" />
        {/* Ajoutez d'autres attributs du ticket ici */}
      </Grid>
    </Container>
  );
};

export default Riri;