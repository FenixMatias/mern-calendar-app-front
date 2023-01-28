import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from '../../src/store/calendar/calendarSlice';
import { calendarWithActiveEventState, calendarWithEventState, events, initialState } from '../fixtures/calendarStates';

describe('Pruebas en el calendarSlice', () => {
  
    test('Debe de regresar el estado inicial ', () => {
      
        const state = calendarSlice.getInitialState();

        expect(state).toEqual(initialState);
    });

    test('Debe de activar el evento onSetActiveEvent ', () => {
      
        const state = calendarSlice.reducer(calendarWithEventState, onSetActiveEvent(events[0]));
        
        expect(state.activeEvent).toEqual(events[0]);
    });

    test('Debe de agregar el evento onAddNewEvent ', () => {
      
        const newEvent = {
            id: 3,
            title: 'Fire Emblem Engage',
            notes: 'Despacho',
            start: new Date('2023-01-24 00:00:00'),
            end: new Date('2023-02-05 23:59:00'),
        }

        const state = calendarSlice.reducer(calendarWithEventState, onAddNewEvent(newEvent));
        
        expect(state.events).toEqual([...events, newEvent]);
    });

    test('Debe de actualizar el evento onUpdateEvent ', () => {
      
        const updateEvent = {
            id: 1,
            title: 'Dias de los enamorados',
            notes: 'Pedir Pizzas',
            start: new Date('2023-01-22 15:19:00'),
            end: new Date('2023-01-23 15:19:00'),
        }

        const state = calendarSlice.reducer(calendarWithEventState, onUpdateEvent(updateEvent));
        
        expect(state.events).toContain(updateEvent);
    });

    test('Debe de borrar el evento activo onDeleteEvent ', () => {

        const state = calendarSlice.reducer(calendarWithActiveEventState, onDeleteEvent());
        
        expect(state.activeEvent).toBe(null);
        expect(state.events).not.toContain(events[0]);
    });

    test('Debe de establecer los eventos onLoadEvents ', () => {

        const state = calendarSlice.reducer(initialState, onLoadEvents(events));
        
        expect(state.isLoadingEvents).toBeFalsy();
        expect(state.events).toEqual([...events]);

        const newstate = calendarSlice.reducer(state, onLoadEvents(events));

        expect(newstate.events.length).toBe(events.length);
    });
    
    test('Debe de limpiar el estado onLogoutCalendar ', () => {

        const state = calendarSlice.reducer(calendarWithActiveEventState, onSetActiveEvent(events));
        const newstate = calendarSlice.reducer(state, onLogoutCalendar());
        
        expect(newstate).toEqual(initialState);
    });
});
