import React from 'react';
import { EquipmentState, EquipmentModel } from '../types/models';

interface EquipmentFilterProps {
    states: EquipmentState[];
    equipmentModels: EquipmentModel[];
    filters: { state?: string; model?: string };
    searchTerm: string;
    onFiltersChange: (filters: { state?: string; model?: string }) => void;
    onSearchChange: (searchTerm: string) => void;
}

const EquipmentFilter: React.FC<EquipmentFilterProps> = ({
    states,
    equipmentModels,
    filters,
    searchTerm,
    onFiltersChange,
    onSearchChange
}) => {
    return (
        <div className="filters" style={{ padding: '1rem' }}>
            <h1>Buscar</h1>
            <input
                type="text"
                placeholder="Pesquisar equipamento..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
            />
            <br />
            <br />
            <select
                onChange={(e) => onFiltersChange({ ...filters, model: e.target.value })}
                value={filters.model || ''}
            >
                <option value="">Todos os modelos</option>
                {equipmentModels.map((model) => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                ))}
            </select>
        </div>
    );
};

export default EquipmentFilter;
