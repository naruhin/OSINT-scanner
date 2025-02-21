import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#00bcd4", // accent blue
        },
        secondary: {
            main: "#ff4081", // pink accent
        },
        background: {
            default: "#121212",
            paper: "#1e1e1e",
        },
        text: {
            primary: "#e0e0e0",
            secondary: "#b0b0b0",
        },
    },
    typography: {
        fontFamily: "'Roboto', sans-serif",
        body1: {
            fontSize: "1.1rem",
            lineHeight: 1.6,
            color: "#e0e0e0",
        },
        body2: {
            fontSize: "1rem",
            lineHeight: 1.5,
            color: "#e0e0e0",
        },
        h3: {
            fontWeight: 700,
            fontSize: "2.5rem",
            color: "#e0e0e0",
        },
        h5: {
            fontWeight: 600,
            fontSize: "1.75rem",
            color: "#e0e0e0",
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: "16px",
                    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.7)",
                    backgroundColor: "#1e1e1e",
                    color: "#e0e0e0",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 600,
                    padding: "12px 24px",
                    transition: "all 0.3s ease",
                    background: "linear-gradient(45deg, #00bcd4, #ff4081)",
                    color: "#fff",
                    "&:hover": {
                        background: "linear-gradient(45deg, #ff4081, #00bcd4)",
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& input": {
                        color: "#e0e0e0",
                    },
                    "& label": {
                        color: "#e0e0e0",
                    },
                },
            },
        },
    },
});

export default theme;
