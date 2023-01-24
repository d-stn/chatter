import { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import SidebarChat from "./SidebarChat";
import "../styles/style.css"

const SidebarChats = ({ hideSidebar }) => {
    const { loggedUser } = useContext(AuthContext)
    const { dispatch } = useContext(ChatContext)

    const [chats, setChats] = useState([])
    // when given value, "chats" is an array of arrays, with the following structure:
    // chats = [
    //     [
    //         combinedId,
    //         {
    //             date: { ...},
    //             userInfo: { displayName: "", photoURL: "", uid: "", lastMessage: ""}
    //         }
    //     ],
    //     [
    //         ...
    //     ]
    // ]

    useEffect(() => {
        const getChats = () => {
            // on snapshot is uset do get real-time data so that chats update in real time if change is done 
            // example: message is sent. The last message to this user in the sidebar chats should also change.
            const unsub = onSnapshot(doc(db, "userChats", loggedUser.uid), (doc) => {
                setChats(doc.data());
            });

            return () => {
                unsub();
            }
        }

        loggedUser.uid && getChats()
    }, [loggedUser.uid])


    const handleSelect = (userInfo) => {
        dispatch({ type: "CLICK_ON_USER", payload: userInfo })
        hideSidebar()
    }

    return (
        <div style={{ overflowY: "auto", padding: "0.8rem 0" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
                    <SidebarChat key={chat[0]} chat={chat[1]} handleSelect={handleSelect} />
                ))}
            </div>
        </div >
    )
}

export default SidebarChats