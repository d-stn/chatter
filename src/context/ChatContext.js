import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const { loggedUser } = useContext(AuthContext)

    const INITIAL_STATE = {
        chatId: "null",
        user: {}
    }

    // clicking on user in sidebar should open chat in content panel
    const chatReducer = (state, action) => {
        switch (action.type) {
            case "CLICK_ON_USER":   // clicking on user in search bar should do the same
                return {
                    user: action.payload,
                    chatId: loggedUser.uid > action.payload.uid
                        ? loggedUser.uid + action.payload.uid
                        : action.payload.uid + loggedUser.uid
                }
            case "RESET_USER":
                return {
                    chatId: "null",
                    user: {}
                }
            case "BLOCK_USER":
                // TODO: add "BLOCK_USER" action
                break;
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE)

    return (
        <ChatContext.Provider value={{ data: state, dispatch }}>
            {children}
        </ChatContext.Provider>
    );
};