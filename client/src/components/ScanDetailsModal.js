import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import dayjs from "dayjs";

const formatDate = (dateString) => {
    if (!dateString) return "";
    return dayjs(dateString).format("MMM D, YYYY h:mm A");
};

const ScanDetailsModal = ({ scan, onClose }) => {
    if (!scan) return null;

    let displayContent;
    try {
        const outputObj = typeof scan.output === "string" ? JSON.parse(scan.output) : scan.output;
        if (outputObj.results && Array.isArray(outputObj.results)) {
            displayContent = outputObj.results.map((item, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                    {item}
                </Typography>
            ));
        } else {
            displayContent = <Typography variant="body2">No data available</Typography>;
        }
    } catch (err) {
        displayContent = <Typography variant="body2">{scan.output}</Typography>;
    }

    return (
        <Modal open={Boolean(scan)} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 600,
                    bgcolor: "background.paper",
                    borderRadius: 4,
                    boxShadow: 24,
                    p: 4,
                    color: "#e0e0e0",
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Scan Details: {scan.domain}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Start:</strong> {formatDate(scan.startTime)}
                </Typography>
                {scan.endTime && (
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>End:</strong> {formatDate(scan.endTime)}
                    </Typography>
                )}
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    Results:
                </Typography>
                <Box
                    sx={{
                        bgcolor: "#2c2c2c",
                        p: 2,
                        borderRadius: 1,
                        maxHeight: 300,
                        overflowY: "auto",
                    }}
                >
                    {displayContent}
                </Box>
                <Button
                    variant="contained"
                    onClick={onClose}
                    fullWidth
                    sx={{
                        mt: 3,
                        background: "linear-gradient(135deg, #5f6368, #80868b)",
                        color: "#fff",
                        borderRadius: "12px",
                        fontWeight: 600,
                        textTransform: "none",
                        padding: "12px 24px",
                        transition: "all 0.3s ease",
                        "&:hover": {
                            background: "linear-gradient(135deg, #80868b, #5f6368)",
                        },
                    }}
                >
                    Close
                </Button>
            </Box>
        </Modal>
    );
};

export default ScanDetailsModal;
