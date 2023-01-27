import Header from "./Header"
import Sidebar from "./Sidebar"
import Chat from "./Chat"
import Notification from "./Notification";
import "../styles/style.css"

const Home = () => {
    const showSidebar = () => {
        document.getElementById("sidebar").className = "sidebar-container show"
    }

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
            <Notification />
            <div className="main-container">
                <Header type="main" showSidebar={showSidebar} />
                <Sidebar />
                <Chat />
            </div>
        </div>
    )
}

export default Home