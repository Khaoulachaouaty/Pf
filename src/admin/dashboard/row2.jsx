import { Box, Paper, Stack, Typography, useTheme } from "@mui/material";
import Pie from "./pie";
import Pie2 from "./pie2";

const Row2 = () => {
  const theme = useTheme();
  return (
    <Stack direction={"row"} gap={1.2} mt={1.3} height="400px" width="100%">
      <Paper sx={{ flex: 1, height: "370px" }}>
        <Stack
          alignItems={"center"}
          direction={"row"}
          justifyContent={"space-between"}
        >
          <Box sx={{ width: "100%", flexGrow: 1, mr: 2 }}>
            <Typography
              color={theme.palette.secondary.main}
              fontWeight={"bold"}
              p={1.2}
              variant="h6"
              ml={2}
              mt={1}
            >
              Techniciens par departement
            </Typography>
            <Pie2 />
          </Box>
        </Stack>
      </Paper>

      <Paper sx={{ flex: 1, height:"370px" }}>
        <Typography
          color={theme.palette.secondary.main}
          fontWeight={"bold"}
          p={1.2}
          variant="h6"
          ml={2}
          mt={1}
        >
          Demandeurs par client
        </Typography>
        <Pie />
      </Paper>
    </Stack>
  );
};

export default Row2;
