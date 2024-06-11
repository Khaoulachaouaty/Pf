import { Container, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

const TicketDetailsPage = ({ tickets }) => {
  const { id } = useParams();

  // Trouver le ticket correspondant à l'ID dans la liste tickets
  const ticket = tickets.find(ticket => ticket.id === parseInt(id));
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Détails du Ticket
      </Typography>
      <Typography variant="h6" gutterBottom>
        Titre : {ticket.title}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Description : {ticket.description}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Catégorie : {ticket.category}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Priorité : {ticket.priority}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Statut : {ticket.status}
      </Typography>
    </Container>
  );
};

export default TicketDetailsPage;


// import { useState } from "react";
// import { Container, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, useTheme } from "@mui/material";
// import { Delete } from "@mui/icons-material";
// import { Link } from "react-router-dom";

// const ViewTicketsPage = () => {
//   const theme = useTheme();
//   const [tickets, setTickets] = useState([
//     { id: 1, title: "Ticket 1", description: "Description du ticket 1", category: "Catégorie 1", priority: "Priorité haute", status: "Ouvert" },
//     { id: 2, title: "Ticket 2", description: "Description du ticket 2", category: "Catégorie 2", priority: "Priorité basse", status: "Fermé" },
//     { id: 3, title: "Ticket 3", description: "Description du ticket 3", category: "Catégorie 3", priority: "Priorité moyenne", status: "En attente" },
//   ]);

//   const handleDelete = (id) => {
//     setTickets(tickets.filter((ticket) => ticket.id !== id));
//   };

//   return (
//     <Container>
//       <Typography variant="h4" gutterBottom>
//         Tickets
//       </Typography>
//       {tickets.length === 0 ? (
//         <Typography>Aucun ticket trouvé.</Typography>
//       ) : (
//         <List>
//           {tickets.map((ticket) => (
//             <ListItem
//               key={ticket.id}
//               button
//               component={Link}
//               to={`ticket-details/${ticket.id}`} // Mettez à jour le chemin avec l'ID du ticket
//               sx={{
//                 backgroundColor:
//                   theme.palette.mode === "light"
//                     ? theme.palette.background.paper
//                     : theme.palette.background.default,
//               }}
//             >
//               <ListItemText
//                 primary={ticket.title}
//                 secondary={ticket.description}
//               />
//               <ListItemSecondaryAction>
//                 <IconButton
//                   edge="end"
//                   aria-label="delete"
//                   onClick={() => handleDelete(ticket.id)}
//                   sx={{
//                     color:
//                       theme.palette.mode === "light"
//                         ? theme.palette.error.main
//                         : theme.palette.error.light,
//                   }}
//                 >
//                   <Delete />
//                 </IconButton>
//               </ListItemSecondaryAction>
//             </ListItem>
//           ))}
//         </List>
//       )}
//     </Container>
//   );
// };

// export default ViewTicketsPage;

