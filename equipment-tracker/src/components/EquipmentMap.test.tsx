import { render, screen, fireEvent } from '@testing-library/react';
import EquipmentMap from './EquipmentMap';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import equipmentReducer from '../store/equipmentSlice';

const store = configureStore({
    reducer: {
        equipment: equipmentReducer,
    },
});

test('renders EquipmentMap and displays search input', () => {
    render(
        <Provider store={store}>
            <EquipmentMap />
        </Provider>
    );

    const searchInput = screen.getByPlaceholderText('Pesquisar equipamento...');
    expect(searchInput).toBeInTheDocument();
});

test('filters equipment by search term', () => {
    render(
        <Provider store={store}>
            <EquipmentMap />
        </Provider>
    );

    const searchInput = screen.getByPlaceholderText('Pesquisar equipamento...');
    fireEvent.change(searchInput, { target: { value: 'Equipment 1' } });
});
