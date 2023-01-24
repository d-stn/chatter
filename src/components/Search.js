import { useContext, useState } from "react"
import { collection, query, where, getDocs, getDoc, setDoc, updateDoc, serverTimestamp, doc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import SidebarChat from "./SidebarChat";
import "../styles/style.css"

const Search = ({ hideSidebar }) => {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);

    const { loggedUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext)

    const handleSearch = async (event) => {
        event.preventDefault();
        const q = query(
            collection(db, "users"),
            where("displayName", "==", username)
        );

        try {
            const noUser = true;

            getDocs(q)
                .then(querySnapshot => {
                    querySnapshot.forEach((doc) => {
                        setUser(doc.data());
                        if (doc) {
                            noUser = false;
                        }
                    });
                })
                .then(() => {
                    if (noUser) {
                        setUser({ displayName: "No matches" })
                    }
                })
        } catch (err) {
            console.error(err);
        }
    };

    const handleUserClick = async () => {
        const combinedId =
            loggedUser.uid > user.uid
                ? loggedUser.uid + user.uid
                : user.uid + loggedUser.uid;

        try {
            hideSidebar()

            const res = await getDoc(doc(db, "chats", combinedId));

            if (!res.exists()) {
                await setDoc(doc(db, "chats", combinedId), { messages: [] });

                await updateDoc(doc(db, "userChats", loggedUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                }).then(() => console.log("sender updated!"))

                await updateDoc(doc(db, "userChats", user.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: loggedUser.uid,
                        displayName: loggedUser.displayName,
                        photoURL: loggedUser.photoURL
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                }).then(() => console.log("receiver updated!"))
            }

            dispatch({ type: "CLICK_ON_USER", payload: user })
        } catch (error) {
            console.error(error);
        }
        setUser(null);
        setUsername("")
    };

    return (
        <div className="search">
            <form onSubmit={handleSearch}>
                <input
                    placeholder="Find a person"
                    onChange={event => {
                        setUsername(event.target.value)
                        if (!event.target.value)
                            setUser(null)
                    }}
                    value={username}
                >
                </input>
            </form>

            <div>
                {user &&
                    <div onClick={handleUserClick} style={{ display: "flex", justifyContent: "center" }}>
                        <SidebarChat
                            chat={{
                                userInfo: { displayName: user.displayName, photoURL: user.photoURL }
                            }}
                        />
                    </div>
                }
            </div>
        </div>
    )
}

export default Search