import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { PasswordIcon, UsernameIcon, EmailIcon } from "../styles/icons";

import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";
import Notification from "./Notification";

const SignUpPage = () => {
    const { setNotification } = useContext(NotificationContext);

    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
        const username = event.target[0].value;
        const email = event.target[1].value;
        const password = event.target[2].value;

        try {
            const q = query(
                collection(db, "users"),
                where("displayName", "==", username)
            );

            const user = await getDocs(q)

            user.forEach(doc => {
                if (doc) {
                    throw new Error("Username already exists");
                }
            })

            const response = await createUserWithEmailAndPassword(auth, email, password);

            await updateProfile(response.user, {
                displayName: username,
                photoURL: "https://firebasestorage.googleapis.com/v0/b/chatter-a7a06.appspot.com/o/default_profile_picture.png?alt=media&token=a53e6d97-73a7-4ff7-8177-1609e62fc47c"
            })


            await setDoc(doc(db, "users", response.user.uid), {
                uid: response.user.uid,
                displayName: username,
                email,
                photoURL: "https://firebasestorage.googleapis.com/v0/b/chatter-a7a06.appspot.com/o/default_profile_picture.png?alt=media&token=a53e6d97-73a7-4ff7-8177-1609e62fc47c"
            })

            await setDoc(doc(db, "userChats", response.user.uid), {})
            navigate("/")
        } catch (err) {
            console.error(err);
            switch (err.message) {
                case "Username already exists":
                    setNotification("Username already exists!")
                    break;
                case "Firebase: Error (auth/email-already-in-use).":
                    setNotification("E-mail is already in use!")
                    break;
                case "Firebase: Error (auth/invalid-email).":
                    setNotification("Invalid email!")
                    break;
                default:
                    console.error(err);
            }
        }
    }

    return (
        <div className="login-container">
            <Notification />
            <div className="login">
                <h1>Sign up</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <i><UsernameIcon /></i>
                        <input placeholder="Username" />
                    </div>
                    <div>
                        <i><EmailIcon /></i>
                        <input type="email" placeholder="E-mail" />
                    </div>
                    <div>
                        <i><PasswordIcon /></i>
                        <input type="password" placeholder="Password" />
                    </div>
                    <button type="submit">sign up</button>
                </form>
                <p>
                    <Link to="/login"> Already have an account? Log in</Link>
                </p>
            </div>
        </div>
    )
}

export default SignUpPage