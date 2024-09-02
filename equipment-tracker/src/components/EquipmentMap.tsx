// src/components/EquipmentMap.tsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setPositions, setStates, setModels, setEquipments } from '../store/equipmentSlice';
import { EquipmentState, EquipmentPositionHistory, EquipmentModel, Equipment, SelectedEquipment } from '../types/models';
import EquipmentFilter from './EquipmentFilter';

import 'leaflet/dist/leaflet.css';
import './EquipmentMap.css';

const SetViewOnLoad = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
    const map = useMap();
    React.useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

const EquipmentMap: React.FC = () => {
    const [selectedEquipment, setSelectedEquipment] = useState<SelectedEquipment | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<{ state?: string; model?: string }>({});
    const [searchTerm, setSearchTerm] = useState<string>('');

    const positions = useSelector((state: RootState) => state.equipment.positions) as EquipmentPositionHistory[] || [];
    const states = useSelector((state: RootState) => state.equipment.states) as EquipmentState[] || [];
    const equipmentModels = useSelector((state: RootState) => state.equipment.models) as EquipmentModel[] || [];
    const equipment = useSelector((state: RootState) => state.equipment.equipments) as Equipment[] || [];
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const equipmentResponse = await fetch('/data/equipment.json');
                if (!equipmentResponse.ok) throw new Error('Erro ao carregar equipamentos');
                const equipmentData = await equipmentResponse.json();
                dispatch(setEquipments(equipmentData));

                const positionsResponse = await fetch('/data/equipmentPositionHistory.json');
                if (!positionsResponse.ok) throw new Error('Erro ao carregar posições');
                const positionsData = await positionsResponse.json();
                dispatch(setPositions(positionsData));

                const statesResponse = await fetch('/data/equipmentState.json');
                if (!statesResponse.ok) throw new Error('Erro ao carregar estados');
                const statesData = await statesResponse.json();
                dispatch(setStates(statesData));

                const modelsResponse = await fetch('/data/equipmentModel.json');
                if (!modelsResponse.ok) throw new Error('Erro ao carregar modelos');
                const modelsData = await modelsResponse.json();
                dispatch(setModels(modelsData));
            } catch (err) {
                console.error('Erro ao carregar dados:', err);
                setError('Erro ao carregar dados');
            }
        };
        fetchData();
    }, [dispatch]);

    if (error) {
        return <div>{error}</div>;
    }

    const handleMarkerClick = (equipmentId: string) => {
        const equipmentItem = equipment.find(item => item.id === equipmentId);
        if (equipmentItem) {
            const selectedEquipment: SelectedEquipment = {
                id: equipmentId,
                states: equipmentItem.states || []
            };
            setSelectedEquipment(selectedEquipment);
        } else {
            setSelectedEquipment(null);
        }
    };

    const getStateName = (stateId: string | undefined) => {
        if (!stateId) {
            return 'Desconhecido';
        }
        const state = states.find(state => state.id === stateId);
        return state ? state.name : 'Desconhecido';
    };

    const getModelName = (modelId: string | undefined) => {
        if (!modelId) {
            return 'Desconhecido';
        }
        const model = equipmentModels.find(model => model.id === modelId);
        return model ? model.name : 'Desconhecido';
    };

    const filteredPositions = positions.filter((position) => {
        const equipmentItem = equipment.find(item => item.id === position.equipmentId);
        if (!equipmentItem) return false;

        const matchesState = !filters.state || (equipmentItem.states && equipmentItem.states.some((state: EquipmentState) => state.id === filters.state));
        const matchesModel = !filters.model || equipmentItem.equipmentModelId === filters.model;
        const matchesSearch = equipmentItem.name.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesState && matchesModel && matchesSearch;
    });

    const center: [number, number] = [-19.126536, -45.947756];
    const zoom = 13;

    return (
        <div style={{ height: '100vh', display: 'flex' }}>
            <MapContainer style={{ height: '100%', width: '75%' }}>
                <SetViewOnLoad center={center} zoom={zoom} />
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredPositions.map((position) => {
                    const equipmentItem = equipment.find(item => item.id === position.equipmentId);
                    if (!equipmentItem || !position.positions.length) return null;

                    const lastPosition = position.positions[position.positions.length - 1];

                    return (
                        <Marker
                            key={position.equipmentId}
                            position={[lastPosition.lat, lastPosition.lon] as [number, number]}
                            eventHandlers={{
                                click: () => handleMarkerClick(position.equipmentId)
                            }}
                        >
                            <Popup>
                                <strong>Equipamento:</strong> {equipmentItem.name} <br />
                                <strong>Modelo:</strong> {getModelName(equipmentItem.equipmentModelId)} <br />
                                <strong>Última posição:</strong> {lastPosition.date} <br />
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            <EquipmentFilter
                states={states}
                equipmentModels={equipmentModels}
                filters={filters}
                searchTerm={searchTerm}
                onFiltersChange={(newFilters) => setFilters(newFilters)}
                onSearchChange={(term) => setSearchTerm(term)}
            />
        </div>
    );
};

export default EquipmentMap;
