import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarEvent, CalendarModal, FabAddNew, FabDelete, Navbar } from '../';
import { localizer, getMessagesEs } from '../../helpers';
import { useEffect, useState } from 'react';
import { useAuthStore, useCalendarStore, useUiStore } from '../../hooks';
  
export const CalendarPage = () => {

    const { events, setActiveEvent, startLoadingEvent } = useCalendarStore();
    const { openDateModal, isDateModalOpen } = useUiStore();
    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month');
    const { user } = useAuthStore();

    const eventStyleGetter = (event, start, end, isSelected) => {

        console.log(event)

        const isMyEvent = (user.uid === event.user._id);

        const style = {
            backgroundColor: isMyEvent ? '#347CF7' : '#465660',
            borderRadius: '0px',
            opacity: 0.8,
            color: 'white'
        }

        return {
            style
        };
    }

    const onDoubleClick = (event) => {

        openDateModal();
    }
    
    const onSelect = (event) => {
    
        setActiveEvent(event);
    }
    
    const onViewChanged = (event) => {
    
        localStorage.setItem('lastView', event);
        setLastView(event);
    }

    useEffect(() => {

        startLoadingEvent();
    }, []);

    return (
        <>
            <Navbar />
            <Calendar
                culture='es'
                localizer={localizer}
                events={events}
                defaultView={lastView}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 'calc(100vh - 80px)' }}
                messages={getMessagesEs()}
                eventPropGetter={eventStyleGetter}
                components={{
                    event: CalendarEvent
                }}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelect}
                onView={onViewChanged}
            />
            <CalendarModal />
            <FabAddNew />
            {isDateModalOpen ? '' : <FabDelete />}
        </>
    )
}

