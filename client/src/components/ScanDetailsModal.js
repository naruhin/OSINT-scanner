import React from 'react';
import { Modal, Box, Typography, Button, Divider, Fade } from '@mui/material';
import dayjs from 'dayjs';

const formatDate = (dateStr) => dayjs(dateStr).format('MMM D, YYYY h:mm A');

const renderOutputContent = (data) => {
    if (typeof data === 'string') {
        try {
            const parsed = JSON.parse(data);
            return renderOutputContent(parsed);
        } catch (error) {
            return <Typography variant="body2">{data}</Typography>;
        }
    }
    if (Array.isArray(data)) {
        return data.map((item, idx) => (
            <Box key={idx} sx={{ mb: 1 }}>
                <Typography variant="body2">• {item}</Typography>
            </Box>
        ));
    }
    if (data && typeof data === 'object') {
        return Object.entries(data).map(([key, value], idx, arr) => (
            <Box key={idx} sx={{ mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {key}:
                </Typography>
                <Typography variant="body2">{String(value)}</Typography>
                {idx < arr.length - 1 && <Divider sx={{ my: 1 }} />}
            </Box>
        ));
    }
    return <Typography variant="body2">{String(data)}</Typography>;
};

const ScanDetailsModal = ({ scan, onClose }) => {
    return (
        <Modal open={Boolean(scan)} onClose={onClose}>
            <Fade in={Boolean(scan)} timeout={300}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 600,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                        outline: 'none',
                    }}
                >
                    <Typography variant="h5" gutterBottom>
                        Scan Details: {scan.domain}
                    </Typography>
                    <Typography variant="body1">Start: {formatDate(scan.startTime)}</Typography>
                    {scan.endTime && (
                        <Typography variant="body1">End: {formatDate(scan.endTime)}</Typography>
                    )}
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Results:
                    </Typography>
                    <Box
                        sx={{
                            mt: 1,
                            p: 2,
                            bgcolor: 'background.default',
                            borderRadius: 1,
                            maxHeight: 300,
                            overflowY: 'auto',
                        }}
                    >
                        {scan.output ? renderOutputContent(scan.output) : <Typography variant="body2">No results</Typography>}
                    </Box>
                    <Button
                        onClick={onClose}
                        sx={{
                            mt: 3,
                            transition: 'background-color 0.3s ease',
                            '&:hover': { backgroundColor: 'grey' },
                        }}
                    >
                        Close
                    </Button>
                </Box>
            </Fade>
        </Modal>
    );
};

export default ScanDetailsModal;
