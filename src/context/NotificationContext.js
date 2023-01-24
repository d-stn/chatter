import { createContext, useReducer } from "react";

export const NotificationContext = createContext();

export const NotificationContextProvider = ({ children }) => {
    let id = null;

    const INITIAL_STATE = {
        message: null
    }

    const notificationReducer = (state, action) => {
        switch (action.type) {
            case "SET_NOTIFICATION":
                if (id !== null) {
                    clearTimeout(id)
                }
                return { ...state, message: action.payload }
            case "HIDE_NOTIFICATION":
                id = null;
                return { message: null }
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(notificationReducer, INITIAL_STATE);

    const setNotification = (text) => {
        dispatch({ type: "SET_NOTIFICATION", payload: text })

        id = setTimeout(() => { dispatch({ type: "HIDE_NOTIFICATION" }) }, 3000)
    }

    return (
        <NotificationContext.Provider value={{ state, setNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};