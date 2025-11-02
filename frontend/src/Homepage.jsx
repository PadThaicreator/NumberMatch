import {  useState } from "react";

import { useNavigate } from "react-router-dom";
import "./css/HomePage.css"
import { Trophy } from "lucide-react";



export default function Homepage(){
      const [gameRoom, setGameRoom] = useState();
      
      const navigate = useNavigate()
     
      const handleJoin = () => {
        navigate("/game" , {state : { gameRoom : gameRoom }})
      };
    
      
      return(
        <div className="container google-font">
          <div className="header">
            <div className="header-text">Number Match</div>
            <div className="header-underline"></div>
          </div>

          <div className="game-room" >
              
              <div style={{display : 'flex' , alignItems : "center" , justifyContent : "center" , gap : '10px' , color : "orange"}}>
                <Trophy  /> 
                <div>Win Game : {localStorage.getItem("winCount") || 0}</div>
              </div>
          </div>
         
          <div className="game-room">
              <label>Game Room</label>
              <input type="text" value={gameRoom} onChange={(e) => setGameRoom(e.target.value)} placeholder="Enter room name"/>
              <button className="confirm-btn" onClick={handleJoin}>Confirm</button>
          </div>
        </div>
    )
}