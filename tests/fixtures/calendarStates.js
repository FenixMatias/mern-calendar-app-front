export const events = [
    {
        id: 1,
        title: 'Dias de los enamorados',
        notes: 'Pedir Sushi',
        start: new Date('2023-01-22 15:19:00'),
        end: new Date('2023-01-23 15:19:00'),
    },
    {
        id: 2,
        title: 'Vacaciones',
        notes: 'Los vilos',
        start: new Date('2023-01-30 15:19:00'),
        end: new Date('2023-02-05 15:19:00'),
    }
]

export const initialState = {
    isLoadingEvents: true,
    events: [],
    activeEvent: null
}

export const calendarWithEventState = {
    isLoadingEvents: false,
    events: [...events],
    activeEvent: null
}

export const calendarWithActiveEventState = {
    isLoadingEvents: false,
    events: [...events],
    activeEvent: {...events[0]}
}