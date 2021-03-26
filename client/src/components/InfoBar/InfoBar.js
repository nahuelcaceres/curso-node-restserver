import React, { useEffect } from 'react';

import closeIcon from '../../icons/closeIcon.png';
import onlineIcon from '../../icons/onlineIcon.png';
import { getUser, removeUserSession } from '../../utils/Common';

import './InfoBar.css';

const InfoBar = ({ room }) => {
   
    const deleteSessionUser = () => {
        console.log('Deberia ver esto antes de ir a home');
        removeUserSession()
    }

    return (
        <div className="infoBar">
            <div className="leftInnerContainer">
                <img className="onlineIcon" src={onlineIcon} alt="online icon" />
                <h3>Room: {room}</h3>
            </div>
            <div className="rightInnerContainer">
                <a href="/"><img src={closeIcon} alt="close icon" onClick={deleteSessionUser}/></a>
            </div>
        </div>
    )

}

export default InfoBar;