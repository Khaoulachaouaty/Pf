import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { DashboardClientService } from '../../services/dashboardClient_service';

const MonthlyTicketsBarChart = () => {
    const [data, setData] = useState([]);

    const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const loadData = async () => {
        try {
            const response = await DashboardClientService.getRealizedTicketsCountByMonth();
            console.log(response);
            const transformedData = response.data.map(item => ({
                month: monthNames[item.month - 1],
                tickets: item.count
            }));
            setData(transformedData);
            console.log("dep", transformedData);
        } catch (error) {
            console.error("Error fetching type data:", error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div style={{ height: 320 , width:870, margin: '0 auto' }}>
            <ResponsiveBar
                data={data}
                keys={['tickets']}
                indexBy="month"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                colors={{ scheme: 'paired' }}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Mois',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Nombre de tickets',
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
                barAriaLabel={e => `${e.indexValue}: ${e.value}`}
            />
        </div>
    );
    
};

export default MonthlyTicketsBarChart;
