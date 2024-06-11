// import React, { useEffect, useState } from 'react';
// import { ResponsiveBar } from '@nivo/bar';
// import { ticketService } from "../../services/ticke_servicet"; // Ajustez le chemin d'importation si nécessaire

// const BarChart = () => {
//     const [data, setData] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await ticketService.getTicketDemandeur();
//                 const tickets = response.data;

//                 if (Array.isArray(tickets)) {
//                     // Filtrer les tickets ayant le statut "A réaliser"
//                     const filteredTickets = tickets.filter(ticket => ticket.interStatut === 'A réaliser');

//                     const processedData = filteredTickets.map(ticket => ({
//                         id: ticket.interCode,
//                         pourcentage: (ticket.intervention.dureeRealisation / ticket.dureePrevue) * 100
//                     }));
//                     setData(processedData);
//                 } else {
//                     console.error('Expected an array but got:', tickets);
//                 }
//             } catch (error) {
//                 console.error('Error fetching ticket data:', error);
//             }
//         };

//         fetchData();
//     }, []);

//     return (
//         <div style={{ height: 320, width: 570, margin: '0 auto' }}>
//             <ResponsiveBar
//                 data={data}
//                 keys={['pourcentage']}
//                 indexBy="id"
//                 margin={{ right: 330, bottom: 50, left: 60 }}
//                 padding={0.3}
//                 layout="horizontal"
//                 colors={{ scheme: 'nivo' }}
//                 borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
//                 axisTop={null}
//                 axisRight={null}
//                 axisBottom={{
//                     tickSize: 5,
//                     tickPadding: 5,
//                     tickRotation: 0,
//                     legend: "Pourcentage d'avancement",
//                     legendPosition: 'middle',
//                     legendOffset: 32,
//                     tickValues: [0,10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
//                    // max: 100
//                 }}
//                 axisLeft={{
//                     tickSize: 5,
//                     tickPadding: 5,
//                     tickRotation: 0,
//                     legend: '',
//                     legendPosition: 'middle',
//                     legendOffset: -40
//                 }}
//                 labelSkipWidth={12}
//                 labelSkipHeight={12}
//                 labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
//                 legends={[
//                     {
//                         dataFrom: 'keys',
//                         anchor: 'bottom-right',
//                         direction: 'column',
//                         justify: false,
//                         translateX: 120,
//                         translateY: 0,
//                         itemsSpacing: 2,
//                         itemWidth: 100,
//                         itemHeight: 20,
//                         itemDirection: 'left-to-right',
//                         itemOpacity: 0.85,
//                         symbolSize: 20,
//                         effects: [
//                             {
//                                 on: 'hover',
//                                 style: {
//                                     itemOpacity: 1
//                                 }
//                             }
//                         ]
//                     }
//                 ]}
//                 role="application"
//                 ariaLabel="Nivo bar chart demo"
//                 barAriaLabel={e => `${e.id}: ${e.value}%`}
//             />
//         </div>
//     );
// };

// export default BarChart;



import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ticketService } from "../../services/ticke_servicet"; // Ajustez le chemin d'importation si nécessaire

const BarChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ticketService.getTicketDemandeur();
                const tickets = response.data;

                if (Array.isArray(tickets)) {
                    // Filtrer les tickets ayant le statut "A réaliser"
                    const filteredTickets = tickets.filter(ticket => ticket.interStatut === 'A réaliser');

                    const processedData = filteredTickets.map(ticket => ({
                        id: ticket.interCode,
                        pourcentage: (ticket.intervention.dureeRealisation / ticket.dureePrevue) * 100
                    }));
                    setData(processedData);
                } else {
                    console.error('Expected an array but got:', tickets);
                }
            } catch (error) {
                console.error('Error fetching ticket data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{ height: 330, width: 570 }}>
            <ResponsiveBar
                data={data}
                keys={['pourcentage']}
                indexBy="id"
                margin={{ right: 160, bottom: 50, left: 60 }}
                padding={0.3}
                layout="horizontal"
                colors={{ scheme: 'nivo' }}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Pourcentage d'avancement",
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: '',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                legends={[
                    {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
                role="application"
                ariaLabel="Nivo bar chart demo"
                barAriaLabel={e => `${e.id}: ${e.value}%`}
            />
        </div>
    );
};

export default BarChart;
