import Search from "./Search"
import SidebarChats from "./SidebarChats"
import "../styles/style.css"

const Sidebar = () => {
    // see if useState then conditional classname is faster than this
    const hideSidebar = () => {
        document.getElementById("sidebar").className = "sidebar-container"
    }
    
    return (
        // className={`sidebar-container ${visible ? "visible" : ""}`}
        <div id="sidebar" className="sidebar-container">
            <Search hideSidebar={hideSidebar} />
            <SidebarChats hideSidebar={hideSidebar} />
        </div>
    )
}

export default Sidebar