import React from 'react';

function Chat({realization}) {
    return (
        <li>
            <img src={`${realization.image}`} alt="Profile"/>
            <div>
                <h4 className={"name"}>{realization.title}</h4>
                <div className={"message"}>Hey, tu as des questions ?</div>
            </div>
        </li>
    );
}

export default Chat;
