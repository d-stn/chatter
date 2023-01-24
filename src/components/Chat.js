import { useContext, useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"
import { ChatContext } from "../context/ChatContext"

// components
import Header from "./Header"
import Input from "./Input"
import Message from "./Message"

import "../styles/style.css"

const Chat = () => {
    const [messages, setMessages] = useState([])
    const { data } = useContext(ChatContext)

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
            doc.exists() && setMessages(doc.data().messages);
        })

        return () => {
            unsub()
        }
    }, [data.chatId])

    if (data.chatId !== "null") {
        return (
            <div className="content-container">
                <Header type="contact" />
                <div className="chat">
                    {messages.map(e => (
                        <Message key={e.id} message={e} />
                    ))}
                </div>
                <Input />
            </div>
        )
    }

    return (
        <div className="content-container">
            <h1
                style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#434343" }}
            >No person selected</h1>
        </div>
    )
}

export default Chat