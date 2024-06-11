import {
    Box,
    IconButton,
    Paper,
    Stack,
    Typography,
    useTheme,
  } from "@mui/material";
import Pie from "./pie";
import BarChart from "./barChart";
  
  const Row2 = () => {
    const theme = useTheme();
    return (
      <Stack direction={"row"} flexWrap={"wrap"} gap={1.2} mt={1.3}>
        <Paper sx={{ maxWidth: 900, flexGrow: 1, minWidth: "400px" }}>
          <Stack
            alignItems={"center"}
            direction={"row"}
            flexWrap={"wrap"}
            justifyContent={"space-between"}
          >
            <Box>
              <Typography
                color={theme.palette.secondary.main}
                mb={1}
                mt={2}
                ml={4}
                variant="h6"
                fontWeight={"bold"}
              >
                Les tickets en retard et à temps pour chaque technicien
              </Typography>
              <BarChart/>
            </Box>
  
            <Box>
              <IconButton sx={{ mr: 3 }}>
              </IconButton>
            </Box>
          </Stack>
  
        </Paper>
  
        <Box
          sx={{
            overflow: "auto",
            borderRadius: "4px",
            maxWidth: "500px",
            minHeight: 455,
            flexGrow: 1,
          }}
        >
          <Paper>
            <Typography
              color={theme.palette.secondary.main}
              fontWeight={"bold"}
              p={1.2}
              variant="h6"
            >
              Tickets par clients
            </Typography>
            <Pie  />
          </Paper>
        </Box>
      </Stack>
    );
  };
  
  export default Row2;
  