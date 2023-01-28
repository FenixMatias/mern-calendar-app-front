import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useUiStore } from '../../src/hooks/useUiStore';
import { uiSlice } from '../../src/store';

const getMockStore = (initialState) => {
    return configureStore({
        reducer: {
            ui: uiSlice.reducer
        },
        preloadedState: {
            ui: {...initialState}
        }
    });
}

describe('Pruebas en el useUiStore', () => {
  
    test('Debe de regresar los valores por defecto ', () => {

        const mockStore = getMockStore({isDateModalOpen: false});
        const { result } = renderHook(() => useUiStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        });

        expect(result.current).toEqual({
            isDateModalOpen: false,
            openDateModal: expect.any(Function),
            closeDateModal: expect.any(Function)
        });
    });

    test('Debe de colocar en true en el isDateModalOpen openDateModal ', () => {
      
        const mockStore = getMockStore({isDateModalOpen: false});
        const { result } = renderHook(() => useUiStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        });

        const { openDateModal } = result.current;

        act(() => {
            openDateModal();
        });

        expect(result.current.isDateModalOpen).toBeTruthy();
    });

    test('Debe de colocar en false en el isDateModalOpen closeDateModal ', () => {
      
        const mockStore = getMockStore({isDateModalOpen: true});
        const { result } = renderHook(() => useUiStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        });

        const { closeDateModal } = result.current;

        act(() => {
            closeDateModal();
        });

        expect(result.current.isDateModalOpen).toBeFalsy();
    });
});
