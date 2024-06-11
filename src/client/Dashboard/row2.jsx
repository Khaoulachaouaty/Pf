import {
  Box,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Pie from "./pie";
import TimeTicketsBarChart from "./timeTicketsBarChart";

const Row2 = () => {
  const theme = useTheme();
  return (
    <Stack direction={"row"} flexWrap={"wrap"} gap={1.2} mt={1.3}>
      <Paper sx={{ flex: 1, minWidth: "855px", height: 350 }}>
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
              Temps passer pour chaque équipement
            </Typography> 
            <TimeTicketsBarChart />
          </Box>
        </Stack>
      </Paper>

      <Paper sx={{ flex: 1, minWidth: "400px", height: 350 }}>
        <Typography
          color={theme.palette.secondary.main}
          fontWeight={"bold"}
          p={1.2}
          variant="h6"
          ml={3}
        >
          Tickets par clients
        </Typography>
        <Box sx={{ height: "calc(100% - 32px)", p: 1 }}>
          <Pie />
        </Box>
      </Paper>
    </Stack>
  );
};

export default Row2;
