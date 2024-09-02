import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Equipment, EquipmentPositionHistory, EquipmentState, EquipmentModel } from '../types/models';

interface EquipmentStateSlice {
    positions: EquipmentPositionHistory[];
    states: EquipmentState[];
    models: EquipmentModel[];
    equipments: Equipment[];
}

const initialState: EquipmentStateSlice = {
    positions: [],
    states: [],
    models: [],
    equipments: []
};

const equipmentSlice = createSlice({
    name: 'equipment',
    initialState,
    reducers: {
        setPositions: (state, action: PayloadAction<EquipmentPositionHistory[]>) => {
            state.positions = action.payload;
        },
        setStates: (state, action: PayloadAction<EquipmentState[]>) => {
            state.states = action.payload;
        },
        setModels: (state, action: PayloadAction<EquipmentModel[]>) => {
            state.models = action.payload;
        },
        setEquipments: (state, action: PayloadAction<Equipment[]>) => {
            state.equipments = action.payload;
        }
    }
});

export const { setPositions, setStates, setModels, setEquipments } = equipmentSlice.actions;

export default equipmentSlice.reducer;
