import { createTheme } from "@mui/material/styles";

export const customTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3f180cff", // AppBar color
    },
    secondary: {
      main: "#1b1a80ff",
    },
    background: {
      default: "#201313ff", // affects Box if using theme.palette.background.default
    },
    text: {
      primary: "#cec0c0ff", // sets primary text color to white
      secondary: "#ffffff", // optional: secondary text
    },
  },
});
