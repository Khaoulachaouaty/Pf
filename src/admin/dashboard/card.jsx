import { Box, Paper, Stack, Typography, useTheme } from "@mui/material";
import { ResponsivePie } from "@nivo/pie";

const Card = ({ title, nombre, icon}) => {

  const theme = useTheme();
  return (
    <Paper
      sx={{
        flexGrow: 1,
        minWidth: "200px",
        p: 1.5,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Stack gap={1}>
        <Typography variant="body2" sx={{ fontSize: "20px", marginTop:1 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "18px", marginTop:1, ml:2 }}>
          {nombre}
        </Typography>
      </Stack>

      <Stack alignItems={"center"}>
        <Box >
          {icon}
        </Box>
      </Stack>
    </Paper>
  );
};

export default Card;
