import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { EmailIcon, PasswordIcon } from "../styles/icons";

import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";
import Notification from "./Notification";


const LoginPage = () => {
    const navigate = useNavigate();
    const { setNotification } = useContext(NotificationContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const email = event.target[0].value;
        const password = event.target[1].value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/")
        } catch (err) {
            switch (err.code) {
                case "auth/wrong-password":
                    setNotification("Wrong password!")
                    break;
                case "auth/user-not-found":
                    setNotification("This user doesn't exist!")
                    break;
                case "auth/invalid-email":
                    setNotification("Invalid email!")
                    break;
                case "auth/too-many-requests":
                    setNotification("Too many attempts! Try again later.")
                    break
                default:
                    console.error(err);
            }
        }
    }

    return (
        <div className="login-container">
            <Notification />
            <div className="login">
                <h1>Welcome back</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <i><EmailIcon /></i>
                        <input type="email" placeholder="E-mail" />
                    </div>
                    <div>
                        <i><PasswordIcon /></i>
                        <input type="password" placeholder="Password" />
                    </div>
                    <button type="submit">login</button>
                </form>
                <p>
                    <Link to="/signup"> Don't have an account? Sign up</Link>
                </p>
            </div>
        </div>

    )
}

export default LoginPage