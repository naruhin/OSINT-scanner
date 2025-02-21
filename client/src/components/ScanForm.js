import React, { useState } from 'react';
import { TextField, Button, Box, Tooltip, Snackbar, Alert } from '@mui/material';
import { motion } from 'framer-motion';

const ScanForm = ({ onScan }) => {
    const [domain, setDomain] = useState('');
    const [error, setError] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const validateDomain = (value) => {
        const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/;
        return domainRegex.test(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!domain.trim()) {
            setError('Please enter a domain');
            setSnackbar({ open: true, message: 'Enter a domain!', severity: 'warning' });
            return;
        }
        if (!validateDomain(domain.trim())) {
            setError('Invalid domain format');
            setSnackbar({ open: true, message: 'Invalid domain format!', severity: 'error' });
            return;
        }
        setError('');
        setSnackbar({ open: true, message: 'Scan started!', severity: 'success' });
        onScan(domain.trim());
        setDomain('');
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, mt: 2, alignItems: 'center' }}>
                <Tooltip title="Enter a valid domain (e.g., example.com)" arrow>
                    <TextField
                        label="Enter domain"
                        variant="outlined"
                        fullWidth
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        error={Boolean(error)}
                        helperText={error}
                        sx={{
                            transition: 'box-shadow 0.3s ease',
                            '&:focus-within': { boxShadow: '0 0 5px rgba(0, 150, 136, 0.5)' },
                        }}
                    />
                </Tooltip>
                <Button
                    type="submit"
                    variant="contained"
                    sx={{
                        transition: 'background-color 0.3s ease, transform 0.3s ease',
                        '&:hover': { backgroundColor: '#00695c', transform: 'scale(1.02)' },
                    }}
                >
                    Scan
                </Button>
            </Box>
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </motion.div>
    );
};

export default ScanForm;
