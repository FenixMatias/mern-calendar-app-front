import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { calendarApi } from '../../src/api';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { authSlice } from '../../src/store';
import { initialState, notAuthenticatedState } from '../fixtures/authStates';
import { testUserCredentials } from '../fixtures/testUser';

const getMockStore = (initialState) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer
        },
        preloadedState: {
            auth: {...initialState}
        }
    });
}

describe('Pruebas en el useAuthStore', () => {

    beforeEach(() => localStorage.clear());
  
    test('Debe de regresar los valores por defecto ', () => {
      
        const mockStore = getMockStore({status: 'checking', user: {}, errorMessage: undefined});
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        });
        
        expect(result.current).toEqual({
            status: 'checking',
            user: {},
            errorMessage: undefined,
            startLogin: expect.any(Function),
            startRegister: expect.any(Function),
            checkAuthToken: expect.any(Function),
            startLogout: expect.any(Function)
        });
    });

    test('Debe de realizar el login correctamente startLogin ', async() => {

        const mockStore = getMockStore({...notAuthenticatedState});
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async() => {
            await result.current.startLogin(testUserCredentials);
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: {
                name: 'Test User', 
                uid: '63cc87dba656052087e0a3c2' 
            }
        });

        expect(localStorage.getItem('token')).toEqual(expect.any(String));
        expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String));
    });

    test('Debe de fallar la auntenticación startLogin ', async() => {

        const mockStore = getMockStore({...notAuthenticatedState});
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async() => {
            await result.current.startLogin({email: 'error@gmail.com', password: '123456789'});
        });

        const { errorMessage, status, user } = result.current;

        expect(localStorage.getItem('token')).toBe(null);
        expect(localStorage.getItem('token-init-date')).toBe(null);
        expect({errorMessage, status, user}).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: 'El email o contraseñas son incorrectas',
        });

        await waitFor(
            () => expect(result.current.errorMessage).toBe(undefined)
        );
    });

    test('Debe de crear un usuario startRegister ', async() => {
      
        const mockStore = getMockStore({...notAuthenticatedState});
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        });

        const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
            data: {
                ok: true,
                uid: "UID",
                name: "Test User",
                token: "TOKEN",
                msg: "Bienvenido Test User"
            }
        });

        await act(async() => {
            await result.current.startRegister({email: 'testuser@gmail.com', password: '123456789', name: 'Test User'});
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User', uid: 'UID' }
        });

        spy.mockRestore();
    });

    test('Debe de fallar la creación startRegister ', async() => {
      
        const mockStore = getMockStore({...notAuthenticatedState});
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async() => {
            await result.current.startRegister(testUserCredentials);
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'Un usuario ya existe con ese email',
            status: 'not-authenticated',
            user: {}
        });
    });

    test('Debe de fallar si no hay token checkAuthToken ', async() => {
      
        const mockStore = getMockStore({...initialState});
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async() => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'not-authenticated',
            user: {}
        });
    });

    test('Debe de autenticar el usuario si hay token checkAuthToken ', async() => {
      
        const { data } = await calendarApi.post('/auth', testUserCredentials);
        
        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({...initialState});
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async() => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User', uid: '63cc87dba656052087e0a3c2' }
        });
    });

    test('Debe de cerrar la sesión del usuario startLogout ', async() => {
      
        const { data } = await calendarApi.post('/auth', testUserCredentials);
        
        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({...initialState});
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async() => {
            await result.current.startLogout();
        });

        const { errorMessage, status, user } = result.current;
        
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'not-authenticated',
            user: {}
        });
    });
});
