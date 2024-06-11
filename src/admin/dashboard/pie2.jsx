import { ResponsivePie } from "@nivo/pie";
import { Box, useTheme } from "@mui/material";
import { DashboardAdminService } from "../../services/dashboardAdmin_service";
import { useEffect, useState } from "react";

const Pie = () => {
  const theme = useTheme();
  const [technicienData, setTechnicienData] = useState([]);

  const loadClient = async () => {
    try {
      const res = await DashboardAdminService.getTotalTechDepart();
      const formattedData = res.data.map((item, index) => ({
        id: item[0],
        label: item[0],
        value: item[1],
        color: `hsl(${index * 30}, 70%, 50%)` // Generate unique color for each item
      }));
      setTechnicienData(formattedData);
      console.log(formattedData, "Formatted data");
    } catch (error) {
      console.error("Error fetching technicien data:", error);
    }
  };

  useEffect(() => {
    loadClient();
  }, []);

  return (
    <Box sx={{ height:"300px" }}>
      {technicienData.length > 0 && (
        <ResponsivePie
          data={technicienData}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.6}
          padAngle={2}
          colors={{ scheme: 'red_blue' }}
          borderColor="#000000"
          arcLinkLabelsTextColor={theme.palette.text.primary}
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor="#000000"
          defs={[
            {
              id: 'dots',
              type: 'patternDots',
              background: 'inherit',
              color: 'rgba(255, 255, 255, 0.3)',
              size: 4,
              padding: 1,
              stagger: true
            },
            {
              id: 'lines',
              type: 'patternLines',
              background: 'inherit',
              color: 'rgba(255, 255, 255, 0.3)',
              rotation: -45,
              lineWidth: 6,
              spacing: 10
            }
          ]}
          fill={[
            {
              match: {
                id: 'ruby'
              },
              id: 'dots'
            },
            {
              match: {
                id: 'c'
              },
              id: 'dots'
            },
            {
              match: {
                id: 'go'
              },
              id: 'dots'
            },
            {
              match: {
                id: 'python'
              },
              id: 'dots'
            },
            {
              match: {
                id: 'scala'
              },
              id: 'lines'
            },
            {
              match: {
                id: 'lisp'
              },
              id: 'lines'
            },
            {
              match: {
                id: 'elixir'
              },
              id: 'lines'
            },
            {
              match: {
                id: 'javascript'
              },
              id: 'lines'
            }
          ]}
        
        />
      )}
    </Box>
  );
};

export default Pie;
