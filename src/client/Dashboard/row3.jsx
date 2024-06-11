import {
  Box,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import BarChart from "./barChart";
import MonthlyTicketsBarChart from "./monthTicketBarChar";

const Row3 = () => {
  const theme = useTheme();
  return (
    <Stack direction={"row"} flexWrap={"wrap"} gap={1.2} mt={1.3}>
      <Paper sx={{ flex: 1, minWidth: "400px", height: 380 }}>
        <Stack
          alignItems={"center"}
          direction={"row"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
        >
          <Box>
            <Typography
              color={theme.palette.secondary.main}
              mt={2}
              ml={4}
              variant="h6"
              fontWeight={"bold"}
            >
              Avencement des tickets
            </Typography>
            <BarChart />
          </Box>
        </Stack>
      </Paper>

      <Paper sx={{ flex: 1, minWidth: "855px", height: 380 }}>
        <Typography
          color={theme.palette.secondary.main}
          fontWeight={"bold"}
          p={1.2}
          ml={3}
          variant="h6"
        >
          Nombre de tickets réalisés durant chaque mois
        </Typography>
        <Box sx={{ height: "calc(100% - 32px)", p: 1 }}>
          <MonthlyTicketsBarChart />
        </Box>
      </Paper>
    </Stack>
  );
};

export default Row3;
