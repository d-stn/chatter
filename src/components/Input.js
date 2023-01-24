import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore"
import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { ChatContext } from "../context/ChatContext"
import { nanoid } from "nanoid"
import { db } from "../firebase"
import "../styles/style.css"
import { SendIcon } from "../styles/icons"

const Input = () => {
    const [message, setMessage] = useState("")
    const { loggedUser } = useContext(AuthContext)
    const { data } = useContext(ChatContext)

    const handleSend = async (event) => {
        event.preventDefault();
        if (message) {
            // input bar must be cleared instantly after user sends a message so
            // we save the value to a new variable and clear the input
            const text = message;
            setMessage("")

            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                    id: nanoid(),
                    text,
                    senderId: loggedUser.uid,
                    date: Timestamp.now()
                })
            })

            // update sender of message
            await updateDoc(doc(db, "userChats", loggedUser.uid), {
                [data.chatId + ".lastMessage"]: {
                    text
                },
                [data.chatId + ".date"]: serverTimestamp()
            })

            // update receiver of message
            await updateDoc(doc(db, "userChats", data.user.uid), {
                [data.chatId + ".lastMessage"]: {
                    text
                },
                [data.chatId + ".date"]: serverTimestamp()
            })
        }
    }

    return (
        <div className="input">
            <form onSubmit={handleSend}>
                <input
                    id="input"
                    value={message}
                    type="text"
                    placeholder="type something"
                    onChange={e => setMessage(e.target.value)}
                    autoComplete="off"
                />
                <button
                    className="button-no-styling"
                    type="submit"

                    // this prevents the keyboard from closing on form submit, which means
                    // messages scroll on button press (without this  line they won't scroll)
                    onPointerDown={(event) => { event.preventDefault() }}
                >
                    <SendIcon />
                </button>
            </form>
        </div >
    )
}

export default Input