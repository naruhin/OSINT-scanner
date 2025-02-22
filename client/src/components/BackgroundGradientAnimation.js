import React, { useEffect, useRef, useState } from 'react';
import {
    Slider,
    Typography,
    IconButton,
    Paper,
    Collapse,
    Button,
} from '@mui/material';
import { Settings as SettingsIcon, RestartAlt as ResetIcon } from '@mui/icons-material';
import * as THREE from 'three';

const DEFAULT_SETTINGS = {
    numNodes: 100,
    maxDistance: 120,
    speed: 1.2,
    nodeSize: 0.7,
};

const BOUNDARY = 250;
const CAMERA_Z = 500;

const BackgroundNeuralWebGL = () => {
    const canvasRef = useRef(null);
    const animationFrameId = useRef(null);
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        if (!canvasRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
        camera.position.z = CAMERA_Z;

        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        const nodeMaterial = new THREE.PointsMaterial({
            color: 0x00ffff,
            size: settings.nodeSize * 2,
            transparent: true,
        });

        const pointsGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(settings.numNodes * 3);
        const velocities = new Float32Array(settings.numNodes * 3);
        for (let i = 0; i < settings.numNodes; i++) {
            const idx = i * 3;
            positions[idx] = (Math.random() - 0.5) * 500;
            positions[idx + 1] = (Math.random() - 0.5) * 500;
            positions[idx + 2] = (Math.random() - 0.5) * 500;
            velocities[idx] = (Math.random() - 0.5) * settings.speed;
            velocities[idx + 1] = (Math.random() - 0.5) * settings.speed;
            velocities[idx + 2] = (Math.random() - 0.5) * settings.speed;
        }
        pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const points = new THREE.Points(pointsGeometry, nodeMaterial);
        scene.add(points);

        const maxSegments = (settings.numNodes * (settings.numNodes - 1)) / 2;
        const linePositions = new Float32Array(maxSegments * 2 * 3);
        const lineGeometry = new THREE.BufferGeometry();
        const lineAttribute = new THREE.BufferAttribute(linePositions, 3);
        lineAttribute.setUsage(THREE.DynamicDrawUsage);
        lineGeometry.setAttribute('position', lineAttribute);
        lineGeometry.setDrawRange(0, 0);

        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.3,
        });
        const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lineSegments);

        const animate = () => {
            animationFrameId.current = requestAnimationFrame(animate);
            let count = 0;
            const posArray = points.geometry.attributes.position.array;

            for (let i = 0; i < settings.numNodes; i++) {
                const iIndex = i * 3;
                posArray[iIndex] += velocities[iIndex];
                posArray[iIndex + 1] += velocities[iIndex + 1];
                posArray[iIndex + 2] += velocities[iIndex + 2];

                for (let j = 0; j < 3; j++) {
                    if (posArray[iIndex + j] > BOUNDARY || posArray[iIndex + j] < -BOUNDARY) {
                        velocities[iIndex + j] *= -1;
                    }
                }

                for (let j = i + 1; j < settings.numNodes; j++) {
                    const jIndex = j * 3;
                    const dx = posArray[iIndex] - posArray[jIndex];
                    const dy = posArray[iIndex + 1] - posArray[jIndex + 1];
                    const dz = posArray[iIndex + 2] - posArray[jIndex + 2];
                    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (distance < settings.maxDistance) {
                        linePositions[count++] = posArray[iIndex];
                        linePositions[count++] = posArray[iIndex + 1];
                        linePositions[count++] = posArray[iIndex + 2];
                        linePositions[count++] = posArray[jIndex];
                        linePositions[count++] = posArray[jIndex + 1];
                        linePositions[count++] = posArray[jIndex + 2];
                    }
                }
            }
            lineGeometry.setDrawRange(0, count / 3);
            lineGeometry.attributes.position.needsUpdate = true;
            points.geometry.attributes.position.needsUpdate = true;
            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId.current);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
        };
    }, [settings]);

    const resetSettings = () => setSettings(DEFAULT_SETTINGS);

    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: -2,
                    background: 'linear-gradient(-45deg, #0D0D0D, #232526, #3F2B96, #16213E, #006064, #0D0D0D)',
                    backgroundSize: '400% 400%',
                    animation: 'gradientAnimation 15s ease infinite',
                }}
            />

            <canvas
                ref={canvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: -1,
                    pointerEvents: 'none',
                }}
            />

            {/* Кнопка открытия настроек */}
            <IconButton
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    bgcolor: 'rgba(28,28,28,0.8)',
                    color: 'cyan',
                    borderRadius: '50%',
                    width: 50,
                    height: 50,
                    transition: 'transform 0.2s ease, box-shadow 0.3s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.6)',
                    '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.8)',
                    },
                    '&:active': {
                        transform: 'scale(0.95)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.6)',
                    },
                }}
                onClick={() => setShowSettings((prev) => !prev)}
            >
                <SettingsIcon />
            </IconButton>

            {/* Панель настроек */}
            <Collapse in={showSettings}>
                <Paper
                    sx={{
                        position: 'fixed',
                        bottom: 80,
                        right: 20,
                        width: 250,
                        p: 2,
                        bgcolor: 'rgba(28,28,28,0.85)',
                        borderRadius: 2,
                        boxShadow: '0 6px 12px rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease-in-out',
                        zIndex: 10,
                    }}
                >
                    <Typography variant="body2" color="cyan" sx={{ fontWeight: 600 }}>
                        Settings
                    </Typography>

                    <Typography variant="caption" color="cyan">
                        Nodes
                    </Typography>
                    <Slider
                        value={settings.numNodes}
                        min={30}
                        max={150}
                        size="small"
                        onChange={(e, value) =>
                            setSettings((prev) => ({ ...prev, numNodes: value }))
                        }
                    />

                    <Typography variant="caption" color="cyan">
                        Max Connection Distance
                    </Typography>
                    <Slider
                        value={settings.maxDistance}
                        min={50}
                        max={300}
                        size="small"
                        onChange={(e, value) =>
                            setSettings((prev) => ({ ...prev, maxDistance: value }))
                        }
                    />

                    <Typography variant="caption" color="cyan">
                        Node Speed
                    </Typography>
                    <Slider
                        value={settings.speed}
                        min={0.5}
                        max={3}
                        step={0.1}
                        size="small"
                        onChange={(e, value) =>
                            setSettings((prev) => ({ ...prev, speed: value }))
                        }
                    />

                    <Typography variant="caption" color="cyan">
                        Node Size
                    </Typography>
                    <Slider
                        value={settings.nodeSize}
                        min={0.3}
                        max={1.5}
                        step={0.1}
                        size="small"
                        onChange={(e, value) =>
                            setSettings((prev) => ({ ...prev, nodeSize: value }))
                        }
                    />

                    <Button
                        startIcon={<ResetIcon />}
                        onClick={resetSettings}
                        fullWidth
                        variant="outlined"
                        sx={{
                            mt: 2,
                            color: 'cyan',
                            borderColor: 'transparent',
                            ':hover': { bgcolor: 'rgba(0,255,255,0.1)' },
                        }}
                    >
                        Reset
                    </Button>
                </Paper>
            </Collapse>

            <style>
                {`
          @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
            </style>
        </>
    );
};

export default BackgroundNeuralWebGL;
