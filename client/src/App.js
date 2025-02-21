import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Container, Typography, Box, Paper } from '@mui/material';
import { DndContext, closestCorners, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import theme from './theme';
import BackgroundGradientAnimation from './components/BackgroundGradientAnimation';
import ScanForm from './components/ScanForm';
import ScanCard from './components/ScanCard';
import ScanDetailsModal from './components/ScanDetailsModal';

function App() {
    const [scans, setScans] = useState([]);
    const [selectedScan, setSelectedScan] = useState(null);

    useEffect(() => {
        fetch('/api/v1/scans')
            .then((response) => response.json())
            .then((data) => setScans(data))
            .catch((error) => console.error('Ошибка при загрузке сканов:', error));
    }, []);

    const handleScan = (domain) => {
        fetch('/api/v1/scans', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain }),
        })
            .then((response) => response.json())
            .then((newScan) => setScans((prev) => [...prev, newScan]))
            .catch((error) => console.error('Ошибка запуска скана:', error));
    };

    const handleShowDetails = (scan) => {
        setSelectedScan(scan);
    };

    const handleCloseModal = () => {
        setSelectedScan(null);
    };

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = scans.findIndex((scan) => scan.id === active.id);
        const newIndex = scans.findIndex((scan) => scan.id === over.id);
        setScans(arrayMove(scans, oldIndex, newIndex));
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BackgroundGradientAnimation />
            <Box sx={{ minHeight: '100vh', py: 4 }}>
                <Container maxWidth="lg">
                    <Paper sx={{ p: 4, mb: 4 }}>
                        <Typography variant="h3" align="center" gutterBottom>
                            OSINT Scanner
                        </Typography>
                        <ScanForm onScan={handleScan} />
                    </Paper>
                    <Paper sx={{ p: 4 }}>
                        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                            <SortableContext items={scans} strategy={rectSortingStrategy}>
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                        gap: 2,
                                        padding: 2,
                                        minHeight: '300px',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                    }}
                                >
                                    {scans.map((scan) => (
                                        <SortableItem key={scan.id} scan={scan} onShowDetails={handleShowDetails} />
                                    ))}
                                </Box>
                            </SortableContext>
                        </DndContext>
                    </Paper>
                </Container>
                {selectedScan && <ScanDetailsModal scan={selectedScan} onClose={handleCloseModal} />}
            </Box>
        </ThemeProvider>
    );
}

export default App;

function SortableItem({ scan, onShowDetails }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: scan.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        width: '100%',
        height: 200,
        opacity: transform ? 0.9 : 1,
    };

    return (
        <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <ScanCard scan={scan} onShowDetails={onShowDetails} />
        </Box>
    );
}
