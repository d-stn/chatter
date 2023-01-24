const SidebarChat = ({ chat, handleSelect }) => {
    return (
        <div
            className="sidebar-chat"
            onClick={handleSelect ? () => handleSelect(chat.userInfo) : undefined}>
            {
                chat.userInfo.photoURL &&
                <img
                    className="big-picture"
                    src={chat.userInfo.photoURL}
                    alt=""
                />
            }
            <span>
                <p className="username">{chat.userInfo.displayName}</p>
                <p className="last-message">{chat.lastMessage?.text}</p>
            </span>
        </div>
    )
}

export default SidebarChat