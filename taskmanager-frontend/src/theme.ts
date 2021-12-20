import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          margin: 0,
          padding: {
            left: 1,
          },
        },
        "html, body, #root": {
          height: "100%",
        },
        ul: {
          listStyle: "none",
        },
      },
    },
  },
});
