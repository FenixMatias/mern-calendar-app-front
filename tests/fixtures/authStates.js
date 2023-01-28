export const initialState = {
    status: 'checking', //'authenticated', 'not-authenticated'
    user: {},
    errorMessage: undefined,
}

export const authenticatedState = {
    status: 'authenticated', //'checking', 'not-authenticated'
    user: {
        uid: 'ABC',
        name: 'Matias',
    },
    errorMessage: undefined,
}

export const notAuthenticatedState = {
    status: 'not-authenticated', //'checking', 'authenticated'
    user: {},
    errorMessage: undefined,
}