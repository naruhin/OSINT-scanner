import React from "react";
import { Card, CardContent, Typography, Chip } from "@mui/material";
import dayjs from "dayjs";

const statusColors = {
    IN_PROGRESS: "warning",
    FAILED: "error",
    COMPLETED: "success",
};

const formatDate = (dateString) => {
    if (!dateString) return "";
    return dayjs(dateString).format("MMM D, YYYY h:mm A"); // e.g., Feb 21, 2025 9:44 AM
};

const ScanCard = ({ scan, onShowDetails }) => {
    return (
        <Card
            onClick={() => onShowDetails(scan)}
            sx={{
                cursor: "pointer",
                borderRadius: "15px",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.5)",
                background: "linear-gradient(135deg, #1e1e1e 0%, #2c2c2c 100%)",
                color: "#e0e0e0",
                p: 2,
            }}
        >
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {scan.domain}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Start: {formatDate(scan.startTime)}
                </Typography>
                {scan.endTime && (
                    <Typography variant="body2" color="text.secondary">
                        End: {formatDate(scan.endTime)}
                    </Typography>
                )}
            </CardContent>
            <CardContent sx={{ pt: 0 }}>
                <Chip label={scan.status} color={statusColors[scan.status] || "default"} sx={{ mt: 1 }} />
            </CardContent>
        </Card>
    );
};

export default ScanCard;
