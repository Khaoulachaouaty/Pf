import { Stack, useTheme } from "@mui/material";
import Card from "./card";
import { useEffect, useState } from "react";
import { DashboardClientService } from "../../services/dashboardClient_service";

const Row1 = () => {
  const theme = useTheme();

  const [total, setTotal] = useState(0);
  const [enAttente, setEnAttente] = useState(0);
  const [aRealiser, setARealiser] = useState(0);
  const [annule, setAnnule] = useState(0);
  const [bloque, setBloque] = useState(0);
  const [realise, setRealise] = useState(0);

  const loadTicketToltal = async () => {
    try {
      const response = await DashboardClientService.getTotalTicket();
      setTotal(response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };

  const loadEnAttenteTicket = async () => {
    try {
      const response = await DashboardClientService.getEnAttenteTicket();
      setEnAttente(response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };

  const loadTicketRealise = async () => {
    try {
      const response = await DashboardClientService.getTicketAReliser();
      setRealise(response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };

  const loadTicketARealise = async () => {
    try {
      const response = await DashboardClientService.getTicketAReliser();
      setARealiser(response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };
  const loadTicketBloque = async () => {
    try {
      const response = await DashboardClientService.getTicketBloque();
      setBloque(response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };

  const loadTicketAnnule = async () => {
    try {
      const response = await DashboardClientService.getTicketAnnuler();
      setAnnule(response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };

  useEffect(() => {
    loadTicketToltal();
    loadEnAttenteTicket();
    loadTicketARealise();
    loadTicketAnnule();
    loadTicketBloque();
    loadTicketRealise();
  }, []);

  return (
    <Stack
      direction={"row"}
      flexWrap={"inherit"}
      gap={1}
      justifyContent={{ xs: "center", sm: "space-between" }}
    >
      <Card
        title={"Total des Tickts"}
        nombre={total}
        increase={"100%"}
        data={[
          {
            id: "Total",
            label: "Total",
            value: 100,
            color: "hsl(22, 90%, 90%)",
          },
        ]}
        scheme={"category10"}
      />

      <Card
        title={"Tickets en attente"}
        nombre={enAttente}
        increase={((enAttente / total) * 100).toFixed(1) + "%"}
        data={[ 
          {
            id: "En attente",
            label: "En attente",
            value: ((enAttente / total) * 100).toFixed(1), // Utilisez le pourcentage par rapport au total
            color: "hsl(22, 90%, 90%)",
          },
          {
            id: "Total",
            label: "Total",
            value: (100 - (enAttente / total) * 100).toFixed(1), // Calculer le pourcentage restant
            color: "hsl(22, 90%, 90%)",
          },
        ]}
        scheme={"accent"}
      />

      <Card
        title={"Tickets à réaliser"}
        nombre={aRealiser}
        increase={((aRealiser / total) * 100).toFixed(1) + "%"}
        data={[
          {
            id: "A réaliser",
            label: "A réaliser",
            value: ((aRealiser / total) * 100).toFixed(1), // Utilisez le pourcentage par rapport au total
            color: "hsl(111, 90%, 90%)",
          },
          {
            id: "Total",
            label: "Total",
            value: (100 - (aRealiser / total) * 100).toFixed(1), // Calculer le pourcentage restant
            color: "hsl(22, 90%, 90%)",
          },
        ]}
        scheme={"dark2"}
      />
      <Card
        title={"Tickets réalisés"}
        nombre={realise}
        increase={((realise / total) * 100).toFixed(1) + "%"}
        data={[
          {
            id: "Total",
            label: "Total",
            value: (100 - (realise / total) * 100).toFixed(1), // Calculer le pourcentage restant
            color: "hsl(22, 90%, 90%)",
          }, 
          {
            id: "Réalisés",
            label: "Réaliser",
            value: ((realise / total) * 100).toFixed(1), // Utilisez le pourcentage par rapport au total
            color: "hsl(111, 90%, 90%)",
          },
        ]}
        scheme={"nivo"}
      />
      <Card
        title={"Tickets bloqués"}
        nombre={bloque}
        increase={((bloque / total) * 100).toFixed(1) + "%"}
        data={[
          {
            id: "Total",
            label: "Total",
            value: (100 - (bloque / total) * 100).toFixed(1), // Calculer le pourcentage restant
            color: "hsl(22, 90%, 90%)",
          },
          {
            id: "Bloqués",
            label: "Bloqué",
            value: ((bloque / total) * 100).toFixed(1),
            color: "hsl(111, 90%, 90%)",
          },
        ]}
        scheme={"red_blue"}
      />

      <Card
        title={"Tickets annulés"}
        nombre={annule}
        increase={((annule / total) * 100).toFixed(1) + "%"}
        data={[
          {
            id: "Annulés",
            label: "Annulés",
            value: ((annule / total) * 100).toFixed(1), // Utilisez le pourcentage par rapport au total
            color: "hsl(111, 90%, 90%)",
          },
          {
            id: "Total",
            label: "Total",
            value: (100 - (annule / total) * 100).toFixed(1), // Calculer le pourcentage restant
            color: "hsl(22, 90%, 90%)",
          },
        ]}
        scheme={"pink_yellowGreen"}
      />
    </Stack>
  );
};

export default Row1;
