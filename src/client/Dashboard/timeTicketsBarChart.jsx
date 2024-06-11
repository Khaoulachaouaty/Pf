import { ResponsiveBar } from '@nivo/bar';

const TimeTicketsBarChart = () => {
    // Données statiques pour les tickets par mois
    const data = [
        { month: 'Janvier', tickets: 10 },
        { month: 'Février', tickets: 15 },
        { month: 'Mars', tickets: 20 },
        { month: 'Avril', tickets: 25 },
        { month: 'Mai', tickets: 30 },
        { month: 'Juin', tickets: 35 },
        { month: 'Juillet', tickets: 40 },
        { month: 'Août', tickets: 45 },
        { month: 'Septembre', tickets: 50 },
        { month: 'Octobre', tickets: 55 },
        { month: 'Novembre', tickets: 60 },
        { month: 'Décembre', tickets: 65 }
    ];

    return (
        <div style={{ height: 300, width: 900, margin: '0 auto' }}>
            <ResponsiveBar
                data={data}
                keys={['tickets']}
                indexBy="month"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                colors={{ scheme: 'accent' }}
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
}

export default TimeTicketsBarChart;
