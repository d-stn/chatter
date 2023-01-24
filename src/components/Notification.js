import { useContext } from "react"
import { NotificationContext } from "../context/NotificationContext"
import "../styles/style.css"

const Notification = () => {
    const { state } = useContext(NotificationContext);

    return (
        <div className={`notification ${state.message ? "visible" : "invisible"}`} >
            {state.message}
        </div>
    )
}

export default Notification