import { Stack } from "@mui/material";
import Card from "./card";
import { useEffect, useState } from "react";
import { demandePRService } from "../../services/demandePR_service";

const Row1 = () => {
  const [stats, setStats] = useState({
    consommé: 0,
    nonConsommé: 0,
    livré: 0,
    renvoyé: 0,
    total: 0,
  });

  useEffect(() => {
    const fetchDemandeData = async () => {
      try {
        const response = await demandePRService.getAllDemandePR();
        console.log(response, "Réponse de getAllDemandePR");

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Data fetched is not an array");
        }

        const demandes = response.data;

        // Filtrer par statutDemande = "Accepter"
        const filteredDemandes = demandes.filter(demande => demande.statutDemande === "Accepter");

        // Grouper les demandes par interCode
        const groupedDemandes = filteredDemandes.reduce((acc, demande) => {
          const interCode = typeof demande.ticket === "object" ? demande.ticket.interCode : demande.ticket;
          if (!acc[interCode]) {
            acc[interCode] = [];
          }
          acc[interCode].push(demande);
          return acc;
        }, {});

        let consomméCount = 0;
        let nonConsomméCount = 0;
        let livréCount = 0;
        let renvoyéCount = 0;
        let totalCount = Object.keys(groupedDemandes).length; // Nombre total des interCodes distincts

        // Calculer les nombres de demandes
        Object.values(groupedDemandes).forEach(demandeGroup => {
          const allConsommé = demandeGroup.every(demande => demande.distingtion === "consommé");
          const hasNonConsommé = demandeGroup.every(demande => demande.distingtion === "non consommé");
          const allLivré = demandeGroup.every(demande => demande.done === "oui");
          const allRenvoyé = demandeGroup.every(demande => demande.done === "non");

          if (allConsommé) consomméCount++;
          if (hasNonConsommé) nonConsomméCount++;
          if (allLivré) livréCount++;
          if (allRenvoyé) renvoyéCount++;
        });

        setStats({
          consommé: consomméCount,
          nonConsommé: nonConsomméCount,
          livré: livréCount,
          renvoyé: renvoyéCount,
          total: totalCount,
        });
      } catch (error) {
        console.error("Error fetching demande data:", error);
      }
    };

    fetchDemandeData();
  }, []);

  console.log(stats, "ssssss");

  return (
    <Stack
      direction={"row"}
      flexWrap={"wrap"}
      gap={1}
      justifyContent={{ xs: "center", sm: "space-between" }}
    >
      <Card
        title={"Demandes à traiter"}
        nombre={stats.nonConsommé}
        increase={((stats.nonConsommé / stats.total) * 100).toFixed(1) + "%"}
        data={[
          {
            id: "A traiter",
            label: "A traiter",
            value: ((stats.nonConsommé / stats.total) * 100).toFixed(1),
            color: "hsl(22, 90%, 90%)",
          },
          {
            id: "Restant",
            label: "Restant",
            value: (100 - (stats.nonConsommé / stats.total) * 100).toFixed(1),
            color: "hsl(22, 90%, 90%)",
          },
        ]}
        scheme={"category10"}
      />

      <Card
        title={"Demandes en attente"}
        nombre={stats.consommé}
        increase={((stats.consommé / stats.total) * 100).toFixed(1) + "%"}
        data={[
          {
            id: "En attente",
            label: "En attente",
            value: ((stats.consommé / stats.total) * 100).toFixed(1),
            color: "hsl(22, 90%, 90%)",
          },
          {
            id: "Restant",
            label: "Restant",
            value: (100 - (stats.consommé / stats.total) * 100).toFixed(1),
            color: "hsl(22, 90%, 90%)",
          },
        ]}
        scheme={"nivo"}
      />

      <Card
        title={"Demandes livrées"}
        nombre={stats.livré}
        increase={((stats.livré / stats.total) * 100).toFixed(1) + "%"}
        data={[
          {
            id: "Livrées",
            label: "Livrées",
            value: ((stats.livré / stats.total) * 100).toFixed(1),
            color: "hsl(111, 90%, 90%)",
          },
          {
            id: "Restant",
            label: "Restant",
            value: (100 - (stats.livré / stats.total) * 100).toFixed(1),
            color: "hsl(22, 90%, 90%)",
          },
        ]}
        scheme={"accent"}
      />

      <Card
        title={"Demandes renvoyées"}
        nombre={stats.renvoyé}
        increase={((stats.renvoyé / stats.total) * 100).toFixed(1) + "%"}
        data={[
          {
            id: "Renvoyées",
            label: "Renvoyées",
            value: (100 - (stats.renvoyé / stats.total) * 100).toFixed(1),
            color: "hsl(22, 90%, 90%)",
          },
          {
            id: "Bloqué",
            label: "Bloqué",
            value: ((stats.renvoyé / stats.total) * 100).toFixed(1),
            color: "hsl(111, 90%, 90%)",
          },
        ]}
        scheme={"dark2"}
      />
    </Stack>
  );
};

export default Row1;
