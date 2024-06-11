import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { ticketService } from "../../services/ticke_servicet"; // Assurez-vous d'importer correctement votre service de ticket
import { adminService } from "../../services/equipement_service"; // Assurez-vous d'importer correctement votre service admin

const TicketBarChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current and archived tickets
        const [currentTicketsResponse, archivedTicketsResponse] = await Promise.all([
          ticketService.getAllTickets(),
          ticketService.getTicketArchivedManager(),
        ]);

        const allTickets = [
          ...currentTicketsResponse.data,
          ...archivedTicketsResponse.data,
        ];

        // Vérifiez si allTickets est un tableau
        if (!Array.isArray(allTickets)) {
          throw new Error("Les données reçues ne sont pas un tableau");
        }

        const equipmentDetailsCache = {};

        const getEquipmentDetails = async (equipment) => {
          if (typeof equipment === "object") {
            return equipment;
          } else if (typeof equipment === "string") {
            if (!equipmentDetailsCache[equipment]) {
              const { data } = await adminService.getEquipement(equipment);
              equipmentDetailsCache[equipment] = data;
            }
            return equipmentDetailsCache[equipment];
          }
          return null;
        };

        const now = new Date();
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(now.getMonth() - 2);

        const filteredTickets = allTickets.filter(
          (ticket) => {
            const ticketDate = new Date(ticket.dateCreation);
            return (
              (ticket.interStatut === "Réalisé" || ticket.interStatut === "A réaliser") &&
              ticketDate >= twoMonthsAgo
            );
          }
        );

        const equipmentPromises = filteredTickets.map(async (ticket) => {
          const equipmentDetails = await getEquipmentDetails(ticket.equipement);
          return { ...ticket, equipement: equipmentDetails };
        });

        const updatedTickets = await Promise.all(equipmentPromises);

        const equipmentCount = updatedTickets.reduce((acc, ticket) => {
          const equipmentName = ticket.equipement?.eqptDesignation || ticket.equipement?.eqptCode || "Unknown";
          if (!acc[equipmentName]) {
            acc[equipmentName] = 0;
          }
          acc[equipmentName]++;
          return acc;
        }, {});

        const chartData = Object.keys(equipmentCount).map((key) => ({
          equipment: key,
          tickets: equipmentCount[key],
        }));

        setData(chartData);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box
      component="main"
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
      }}
    >
     
      <Box sx={{ height: 400, width: "100%" }}>
        <ResponsiveBar
          data={data}
          keys={["tickets"]}
          indexBy="equipment"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={{ scheme: "nivo" }}
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Équipements",
            legendPosition: "middle",
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Nombre de tickets",
            legendPosition: "middle",
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: "left-to-right",
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </Box>
    </Box>
  );
};

export default TicketBarChart;
