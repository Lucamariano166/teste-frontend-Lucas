export interface Equipment {
    id: string;
    name: string;
    states?: EquipmentState[];
    equipmentModelId?: string;
}

export interface EquipmentPositionHistory {
    equipmentId: string;
    positions: Position[];
}

export interface Position {
    lat: number;
    lon: number;
    date: string;
}

export interface EquipmentState {
    id: string;
    name: string;
    date?: string;
}

export interface EquipmentModel {
    id: string;
    name: string;
}

export interface SelectedEquipment {
    id: string;
    states: EquipmentState[];
}
