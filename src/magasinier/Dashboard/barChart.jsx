import { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { demandePRService } from '../../services/demandePR_service';

const BarChart = () => {
    const [data, setData] = useState([]);

    const loadData = async () => {
        try {
            const response = await demandePRService.getAllDemandePR();
            console.log(response.data, "demande");
    
            // Filter demands where demande.done equals "oui"
            const filteredDemands = response.data.filter(demande => demande.done === "oui");
    
            // Transformation des données
            const articles = filteredDemands.map(demande => ({
                id: demande.id,
                nomArticle: demande.article.nomArticle,
                quantiteDemande: demande.quantiteDemande
            }));
    
            // Regrouper par nom d'article et sommer les quantités demandées
            const groupedData = articles.reduce((acc, curr) => {
                const found = acc.find(item => item.nomArticle === curr.nomArticle);
                if (found) {
                    found.quantiteDemande += curr.quantiteDemande;
                } else {
                    acc.push({ nomArticle: curr.nomArticle, quantiteDemande: curr.quantiteDemande });
                }
                return acc;
            }, []);
    
            // Trier par quantité demandée et prendre les 10 premiers
            const top10Data = groupedData.sort((a, b) => b.quantiteDemande - a.quantiteDemande).slice(0, 10);
    
            setData(top10Data);
            console.log("Transformed Data:", top10Data);
        } catch (error) {
            console.error("Error fetching PR data:", error);
        }
    };
    
    
    useEffect(() => {
        loadData();
    }, []);

    return (
        <div style={{ height: '350px', width: 800 }}>
            <ResponsiveBar
                data={data}
                keys={['quantiteDemande']}
                indexBy="nomArticle"
                margin={{ top: 20, right: 10, bottom: 50, left: 60 }}
                padding={0.3}
                groupMode="grouped"
                colors={{ scheme: 'nivo' }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Articles',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Quantité Utilisée',
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
