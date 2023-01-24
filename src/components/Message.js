import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import "../styles/style.css"

const Message = ({ message }) => {
    const { loggedUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const ref = useRef();

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);



    return (
        <div ref={ref} className={`message ${message.senderId === loggedUser.uid && "sender"}`}>
            <div className="messageInfo">
                <img
                    className="small-picture"
                    src={
                        message.senderId === loggedUser.uid
                            ? loggedUser.photoURL
                            : data.user.photoURL
                    }
                    alt=""
                />
            </div>
            <div style={{ display: "flex" }}>
                <p>{message.text}</p>
                {message.img && <img src={message.img} alt="" />}
            </div>
        </div>
    );
};

export default Message;