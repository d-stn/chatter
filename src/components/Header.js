import { useContext, useState, useRef, useEffect } from "react"
import { signOut, updateProfile } from "firebase/auth"
import { doc, updateDoc, getDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { db, storage, auth } from "../firebase"
import { AuthContext } from "../context/AuthContext"
import { ChatContext } from "../context/ChatContext"
import { MenuIcon } from "../styles/icons"
import "../styles/style.css"

const Header = ({ type, showSidebar }) => {
    const { loggedUser } = useContext(AuthContext)
    const { data, dispatch } = useContext(ChatContext)

    // when user changes profile pic, setUrl is called and picture updates without page refresh
    const [url, setUrl] = useState(loggedUser.photoURL)
    const [dropdown, setDropdown] = useState(false);
    const dropdownRef = useRef();

    // click outside to close dropdown menu
    useEffect(() => {
        const handler = (e) => {
            if (!dropdownRef.current?.contains(e.target)) {
                setDropdown(false);
            }
        };

        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        }

    }, []);


    const selectImage = (image) => {
        if (image) {
            if (image.size > 1_048_576) {
                throw new Error("Image too big!")
            }
            const storageRef = ref(storage, `${loggedUser.displayName}_profile_picture`)

            uploadBytes(storageRef, image)
                .then((snapshot) => {
                    getDownloadURL(snapshot.ref).then(async (url) => {
                        await updateProfile(loggedUser, {
                            photoURL: url
                        })
                        setUrl(url)
                        await updateDoc(doc(db, "users", loggedUser.uid), {
                            photoURL: url
                        })
                        // Other users get data for their sidebar and chat from "userChats" collection.
                        // Upon profile picture change, all occurances of old picture in "userChats" 
                        // should be updated with the new picture
                        try {
                            const chatsOfUser = await getDoc(doc(db, "userChats", loggedUser.uid))
                            const IdsToUpdate = Object.entries(chatsOfUser.data())?.map(e => e[1].userInfo.uid);

                            IdsToUpdate.forEach(async (id) => {
                                const combinedId =
                                    loggedUser.uid > id
                                        ? loggedUser.uid + id
                                        : id + loggedUser.uid;

                                await updateDoc(doc(db, "userChats", id), {
                                    [combinedId + ".userInfo"]: {
                                        displayName: loggedUser.displayName,
                                        photoURL: url,
                                        uid: loggedUser.uid
                                    }
                                })
                            })
                        } catch (error) {
                            console.error("Error chaning profile picture", error);
                        }
                    })
                })
        }
    }

    switch (type) {
        case "main":
            return (
                <div className="main-header">
                    <button
                        className="menu-button"
                        onClick={showSidebar}
                    >
                        <MenuIcon />
                    </button>

                    <div ref={dropdownRef}>
                        <img
                            onClick={() => setDropdown(!dropdown)}
                            className="big-picture dropdown"
                            src={url}
                            alt="">
                        </img>
                        <div className={`dropdown-menu ${dropdown ? "visible" : "hidden"}`}>
                            <ul>
                                <li>
                                    <label
                                        onClick={() => setDropdown(false)}
                                        style={{ cursor: "pointer" }}
                                        htmlFor="file">
                                        Change profile picture
                                    </label>
                                    <input
                                        type="file"
                                        id="file"
                                        style={{ display: "none" }}
                                        accept="image/png, image/jpeg"
                                        onChange={(event) => selectImage(event.target.files[0])}
                                    />
                                </li>
                                <li
                                    onClick={() => {
                                        setDropdown(false)
                                        dispatch({ type: "RESET_USER" })
                                        signOut(auth)
                                    }}>
                                    Logout
                                </li>
                            </ul>
                        </div>
                    </div>
                    <h2>{loggedUser.displayName}</h2>
                </div>
            )

        case "contact":
            return (
                <div className="contact-header">
                    <h2>{data.user.displayName}</h2>
                </div>
            )
        default:
            console.error("incorrect \"type\" prop passed to \"Header\" component");
    }
}

export default Header