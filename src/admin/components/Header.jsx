import { Box, Typography, useTheme } from "@mui/material";





const Header = ({title, subTitle, isDashboard=false}) => {
  const theme = useTheme();
  return (
    <Box mb={ isDashboard? 2 :4}>
    <Typography
      sx={{
        color: theme.palette.mode === "light" ? theme.palette.primary.main: theme.palette.primary.main,
        fontWeight: "bold",
        
      }}
      variant="h5"
    >
      {title}
    </Typography>
    <Typography variant="body1">{subTitle}</Typography>
  </Box>

  
  );
}

export default Header;
