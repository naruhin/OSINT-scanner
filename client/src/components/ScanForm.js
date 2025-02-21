import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

const ScanForm = ({ onScan }) => {
    const [domain, setDomain] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (domain.trim()) {
            onScan(domain.trim());
            setDomain("");
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", gap: 2 }}>
            <TextField
                label="Enter domain"
                variant="outlined"
                fullWidth
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                sx={{
                    backgroundColor: "#2c2c2c",
                    borderRadius: "8px",
                    "& input": { color: "#e0e0e0" },
                    "& label": { color: "#b0b0b0" },
                }}
            />
            <Button
                type="submit"
                variant="contained"
                sx={{
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
                Scan
            </Button>
        </Box>
    );
};

export default ScanForm;
