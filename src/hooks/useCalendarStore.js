import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { calendarApi } from '../api';
import { convertEventToDay } from '../helpers';
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from '../store';

export const useCalendarStore = () => {

    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector(state => state.calendar);
    const { user } = useSelector(state => state.auth);

    const setActiveEvent = (calendarEvent) => {

        dispatch(onSetActiveEvent(calendarEvent));
    }

    const startSavingEvent = async(calendarEvent) => {

        //TODO: llegar al backend

        try {

            if(calendarEvent.id){
            
                //Actualizando
                const { data } = await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);
    
                dispatch(onUpdateEvent({...calendarEvent, user}));

                Swal.fire({
                    icon: 'success',
                    title: 'Listo!',
                    text: data.msg
                });
    
                return;
            }
            //Creando
            const { data } = await calendarApi.post('/events', calendarEvent);
    
            dispatch(onAddNewEvent({...calendarEvent, id: data.evento.id, user: user}));

            Swal.fire({
                icon: 'success',
                title: 'Listo!',
                text: data.msg
            });
            
        } catch (error) {
            
            console.log(error);

            Swal.fire({
                icon: 'error',
                title: 'Error al guardar!',
                text: error.response.data.msg
            });
        }
        
    }

    const startDeleteEvent = async() => {

        //TODO: llegar al backend

        try {

            const { data } = await calendarApi.delete(`/events/${activeEvent.id}`);
    
            dispatch(onDeleteEvent());

            Swal.fire({
                icon: 'success',
                title: 'Listo!',
                text: data.msg
            });
    
            return;
            
        } catch (error) {
            
            console.log(error);

            Swal.fire({
                icon: 'error',
                title: 'Error al eliminar!',
                text: error.response.data.msg
            });
        }

    }

    const startLoadingEvent = async() => {

        try {

            const { data } = await calendarApi.get('/events');
            const events = convertEventToDay(data.events);

            dispatch(onLoadEvents(events)); 
        } catch (error) {

            console.log('Error al cargar eventos');
            console.log(error);
        }
    }

    return {
        //*Propiedades
        events,
        activeEvent,
        hasEventSelected: !!activeEvent,

        //*Metodos
        setActiveEvent,
        startSavingEvent,
        startDeleteEvent,
        startLoadingEvent
    }
}