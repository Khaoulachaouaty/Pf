import { useLocation } from "react-router-dom";

const TicketDetail = () => {
  const location = useLocation();
  const { ticketData } = location.state;

  // Vérifier si ticketData est défini avant d'accéder à ses propriétés
  if (!ticketData) {
    return <div>Données du ticket non disponibles</div>;
  }

  return (
    <div>
      <h2>Details du Ticket</h2>
      <div>
        <p>Code: {ticketData.interCode}</p>
        <p>Description: {ticketData.description}</p>
        <p>Date de création: {ticketData.dateCreation}</p>
        <p>Date de clôture: {ticketData.dateCloture}</p>
        <p>Date prévue: {ticketData.datePrevue}</p>
        <p>Heure prévue: {ticketData.heurePrevue}</p>
        <p>Durée prévue: {ticketData.dureePrevue}</p>
        <p>Unité de durée: {ticketData.unitCodeDuree}</p>
        <p>Localisation de l'intervention: {ticketData.intervLocalisation}</p>
        <p>Sous garantie: {ticketData.sousGarantie}</p>
        <p>Sous contrat: {ticketData.sousContrat}</p>
        <p>Statut: {ticketData.interStatut}</p>
        <p>Durée d'arrêt: {ticketData.dureeArret}</p>
        <p>Heure d'arrêt: {ticketData.heureArret}</p>
        <p>Montant d'hébergement: {ticketData.interMtHebergement}</p>
        <p>Montant de déplacement: {ticketData.interMtDeplacement}</p>
        <p>Domaine de l'intervention: {ticketData.interDomaine}</p>
        <p>Difficulté: {ticketData.difficulte}</p>
        <p>Compte rendu: {ticketData.compteRendu}</p>
        <p>Intervention priorité: {ticketData.interventionPriorite}</p>
        <p>Intervention cause: {ticketData.interventionCause}</p>
        <p>Intervention observation: {ticketData.interventionObservation}</p>
        <p>Machine arrêtée: {ticketData.machineArret}</p>
        <p>Intervention client: {ticketData.client}</p>
        {/* Ajoutez d'autres attributs du ticket ici */}
      </div>
    </div>
  );
};

export default TicketDetailPage;
