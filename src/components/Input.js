import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore"
import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { ChatContext } from "../context/ChatContext"
import { nanoid } from "nanoid"
import { db, storage } from "../firebase"
import { ImageIcon, SendIcon } from "../styles/icons"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { NotificationContext } from "../context/NotificationContext";
import "../styles/style.css"

const Input = () => {
    const [message, setMessage] = useState("")
    const [image, setImage] = useState(null);
    const { loggedUser } = useContext(AuthContext)
    const { data } = useContext(ChatContext)
    const { setNotification } = useContext(NotificationContext)

    const handleSend = async (event) => {
        event.preventDefault();
        // input bar must be cleared instantly after user sends a message so
        // we save the value to a new variable and clear the input
        const text = message;
        setMessage("")

        // add maximum size for image
        if (image) {
            if (image.size > 1_048_576) {
                setNotification("Image too big!")
                throw new Error("Image too big!")
            }
            const storageRef = ref(storage, nanoid())
            uploadBytes(storageRef, image)
                .then((snapshot) => {
                    getDownloadURL(snapshot.ref).then(async (url) => {
                        await updateDoc(doc(db, "chats", data.chatId), {
                            messages: arrayUnion({
                                id: nanoid(),
                                text,
                                image: url,
                                senderId: loggedUser.uid,
                                date: Timestamp.now()
                            })
                        })

                        // update sender of message
                        await updateDoc(doc(db, "userChats", loggedUser.uid), {
                            [data.chatId + ".lastMessage"]: {
                                // text: text ? text : `${data.user.displayName} sent a photo`
                                text: "You sent a photo"
                            },
                            [data.chatId + ".date"]: serverTimestamp()
                        })

                        // update receiver of message
                        await updateDoc(doc(db, "userChats", data.user.uid), {
                            [data.chatId + ".lastMessage"]: {
                                text: `${loggedUser.displayName} sent a photo`
                            },
                            [data.chatId + ".date"]: serverTimestamp()
                        })
                    })
                })
        }
        else if (text) {
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
                    // text: text ? text : `${data.user.displayName} sent a photo`
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
        setImage(null)
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
                <input
                    type="file"
                    style={{ display: "none" }}
                    id="image"
                    accept="image/png, image/jpeg"
                    onChange={e => { setImage(e.target.files[0]) }}
                />
                <label
                    htmlFor="image"
                    style={{ cursor: "pointer" }}>
                    <ImageIcon />
                </label>
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