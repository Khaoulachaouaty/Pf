import { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { dashboardTechnicienService } from '../../services/dashboardTechnicien_service';

const BarChart = () => {
    const [data, setData] = useState([]);

    const loadData = async () => {
        try {
            const response = await dashboardTechnicienService.getCountByMonth();
            console.log(response)
            // Transform the data to fit the bar chart format
            const transformedData = response.data.map(item => ({
                mois: getMonthName(item.mois), // Convert month number to month name
                retard: item.nombreTicketsEnRetard,
                a_temps: item.nombreTicketsATemps
            }));
            setData(transformedData);
            console.log("Transformed Data:", transformedData);
        } catch (error) {
            console.error("Error fetching data by month:", error);
        }
    };

    // Function to convert month number to month name
    const getMonthName = (monthNumber) => {
        const date = new Date();
        date.setMonth(monthNumber - 1); // Month number in response is 1-based, Date object month is 0-based
        return date.toLocaleString('default', { month: 'long' });
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div style={{ height: '400px', width: '100%' }}>
            <ResponsiveBar
                data={data}
                keys={['retard', 'a_temps']}
                indexBy="mois"
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

export default BarChart
