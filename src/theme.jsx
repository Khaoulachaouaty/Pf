export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: {
            main: "#0e7190",
          },
          secondary: {
            main: "#155c75", // Couleur de fond par défaut pour le mode clair
          },
          background: {
            main: "#ffffff",
          }
        }
      : {
          primary: {
            main: "#d3f6fa",
          },
          secondary: {
            main: "#cff9fe", // Couleur de fond par défaut pour le mode sombre
          },
          background: {
            main: "#292929"
          }
        }),
  },
});
