import React from 'react';
import { Card, CardContent, Typography, Chip, Box, Tooltip } from '@mui/material';
import { CheckCircle, Error, HourglassEmpty, Loop } from '@mui/icons-material';
import dayjs from 'dayjs';

const ScanCard = ({ scan, onShowDetails }) => {
    const formatDate = (dateStr) => dayjs(dateStr).format('MMM D, YYYY h:mm A');

    const getStatusProps = (status) => {
        switch (status) {
            case 'COMPLETED':
                return { label: 'Success', icon: <CheckCircle />, bgColor: 'rgba(27, 94, 32, 0.8)', shadow: '0 4px 12px rgba(27, 94, 32, 0.4)', tooltip: 'Scan completed successfully' };
            case 'FAILED':
                return { label: 'Error', icon: <Error />, bgColor: 'rgba(183, 28, 28, 0.8)', shadow: '0 4px 12px rgba(183, 28, 28, 0.4)', tooltip: 'Scan failed' };
            case 'IN_PROGRESS':
                return { label: 'Scanning...', icon: <Loop />, bgColor: 'rgba(13, 71, 161, 0.8)', shadow: '0 4px 12px rgba(13, 71, 161, 0.4)', tooltip: 'Scan in progress' };
            case 'QUEUED':
                return { label: 'Pending', icon: <HourglassEmpty />, bgColor: 'rgba(66, 66, 66, 0.8)', shadow: '0 4px 12px rgba(66, 66, 66, 0.4)', tooltip: 'Scan queued' };
            default:
                return { label: 'Unknown', icon: null, bgColor: 'rgba(117, 117, 117, 0.8)', shadow: '0 4px 12px rgba(117, 117, 117, 0.4)', tooltip: 'Status unknown' };
        }
    };

    const statusProps = getStatusProps(scan.status);

    return (
        <Card
            sx={{
                cursor: 'pointer',
                height: 200,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                backgroundColor: 'rgba(20, 20, 20, 0.7)',
                '&:hover': { transform: 'scale(1.02)', boxShadow: '0 6px 12px rgba(255,255,255,0.1)' },
                borderRadius: '10px',
            }}
            onClick={() => onShowDetails(scan)}
        >
            <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" noWrap sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    {scan.domain}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    Start: {formatDate(scan.startTime)}
                </Typography>
                {scan.endTime && (
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        End: {formatDate(scan.endTime)}
                    </Typography>
                )}
            </CardContent>
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                }}
            >
                <Tooltip title={statusProps.tooltip} arrow>
                    <Chip
                        label={statusProps.label}
                        icon={statusProps.icon}
                        sx={{
                            backgroundColor: statusProps.bgColor,
                            color: '#fff',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            padding: '6px 12px',
                            boxShadow: statusProps.shadow,
                            backdropFilter: 'blur(8px)',
                            transition: 'transform 0.3s ease',
                            '&:hover': { transform: 'scale(1.05)' },
                            '& .MuiChip-icon': { fontSize: 20, color: 'rgba(255, 255, 255, 0.8)' },
                        }}
                    />
                </Tooltip>
            </Box>
        </Card>
    );
};

export default ScanCard;
