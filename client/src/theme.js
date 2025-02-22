import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#064d85' },
        background: {
            default: '#0D0D0D',
            paper: 'rgba(28,28,28,0.6)',
        },
        text: {
            primary: '#E0E0E0',
            secondary: '#B0B0B0',
        },
    },
    typography: {
        fontFamily: "'Inter', 'Roboto', sans-serif",
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    padding: '10px 20px',
                    fontWeight: 600,
                    borderRadius: 12,
                    backgroundColor: 'rgba(0,87,161,0.8)',
                    color: '#ffffff',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        backgroundColor: 'rgb(0,56,99)',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.7)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(28,28,28,0.6)',
                    borderRadius: 12,
                    '& .MuiInputBase-input': {
                        color: '#E0E0E0',
                        padding: '10px',
                    },
                    '& .MuiInputLabel-root': {
                        color: 'rgba(224,224,224,0.8)',
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'rgba(224,224,224,0.3)',
                            borderRadius: 12,
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(224,224,224,0.5)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'rgba(224,224,224,0.7)',
                        },
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.7)',
                    padding: '16px',
                    backgroundColor: 'rgba(28,28,28,0.7)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: '16px',
                    backgroundColor: 'rgba(28,28,28,0.6)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.7)',
                },
            },
        },
    },
});

export default theme;
