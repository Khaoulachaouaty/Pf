import { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { DashboardManagerService } from '../../services/dashboardManager_service';

const BarChart = () => {
    const [data, setData] = useState([]);

    const loadData = async () => {
        try {
            const response = await DashboardManagerService.getCountByTechnicien();
            console.log(response)
            const transformedData = response.data.map(item => ({
                technicien: `${item.technicienPrenom} ${item.technicienNom}`,
                retard: item.nombreTicketsEnRetard,
                a_temps: item.nombreTicketsATemps
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
        <div style={{ height: '400px', width: 800 }}>
            <ResponsiveBar
                data={data}
                keys={['retard', 'a_temps']}
                indexBy="technicien"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                groupMode="grouped"
                colors={['#ff6347', '#4682b4']}
                labelSkipWidth={12}
                labelSkipHeight={12}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Techniciens',
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
                animate={true}
                motionStiffness={90}
                motionDamping={15}
            />
        </div>
    );
};

export default BarChart;
