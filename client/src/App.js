import React, { useState, useEffect } from "react";
import { ThemeProvider, Container, Typography, Box, Paper, Grid } from "@mui/material";
import { motion } from "framer-motion";
import theme from "./theme";
import ScanForm from "./components/ScanForm";
import ScanCard from "./components/ScanCard";
import ScanDetailsModal from "./components/ScanDetailsModal";

function App() {
    const [scans, setScans] = useState([]);
    const [selectedScan, setSelectedScan] = useState(null);

    useEffect(() => {
        fetchScansFromServer();
    }, []);

    const fetchScansFromServer = () => {
        fetch(`/scans`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error fetching scans list");
                }
                return response.json();
            })
            .then((data) => setScans(data))
            .catch((error) => console.error("Error:", error));
    };

    const handleScan = (domain) => {
        fetch(`/scan`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ domain }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error launching scan");
                }
                return response.json();
            })
            .then((newScan) => {
                setScans((prev) => [...prev, newScan]);
            })
            .catch((error) => console.error("Error:", error));
    };

    const handleShowDetails = (scan) => {
        setSelectedScan(scan);
    };

    const handleCloseModal = () => {
        setSelectedScan(null);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
                    backgroundSize: "800% 800%",
                    animation: "gradientAnimation 15s ease infinite",
                    minHeight: "100vh",
                    py: 4,
                    px: 2,
                }}
            >
                {/* Global keyframes for animated gradient */}
                <style>{`
          @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
                <Container maxWidth="lg">
                    <Paper sx={{ p: 4, mb: 4 }}>
                        <Typography variant="h3" align="center" gutterBottom>
                            OSINT Scanner
                        </Typography>
                        <ScanForm onScan={handleScan} />
                    </Paper>
                    <Paper sx={{ p: 4 }}>
                        {scans.length === 0 ? (
                            <Typography align="center" color="text.secondary">
                                No scans available. Launch your first scan!
                            </Typography>
                        ) : (
                            <Grid container spacing={3}>
                                {scans.map((scan) => (
                                    <Grid item xs={12} sm={6} md={4} key={scan.id}>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <ScanCard scan={scan} onShowDetails={handleShowDetails} />
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Paper>
                </Container>
                {selectedScan && (
                    <ScanDetailsModal scan={selectedScan} onClose={handleCloseModal} />
                )}
            </Box>
        </ThemeProvider>
    );
}

export default App;
