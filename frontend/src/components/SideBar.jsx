import { useContext } from "react";
import Context from "../Context";
import "../css/Sidebar.css"

// import { useNavigate } from "react-router-dom";
import socket from "../socket";
export default function SideBar() {
  const { target , roomName  } = useContext(Context);
  // const navigate = useNavigate()
  const handleExit  = () =>{
      socket.emit("restartGame", { room: roomName , isExit : true });
      // navigate("/")
  }
  return (
    <div>
      {/* <div>
        <div>Your Score : {yourScore}</div>
        <div>Your Hp : {yourHp}</div>{" "}
      </div>
      <div>
        <div>Opponent Score : {opponentScore}</div>
        <div>Opponent Hp : {opponentHp}</div>
      </div> */}
      {/* <div className="card">Time : {time}</div> */}
      <div className="card">Target : {target}</div>
      <div className="exit-btn" onClick={handleExit}>Exit Game</div>
      {/* <button onClick={handleResultExpression}>Result Expression</button>
            <div>Result Expression : {eval(resultExpression)}</div> */}
    </div>
  );
}
