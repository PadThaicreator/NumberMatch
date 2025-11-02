import { useContext } from "react";
import Context from "../Context";
import "../css/Header.css";
import { Heart } from "lucide-react"

export default function Header() {
  const {
    yourHp,
    yourScore,
    opponentScore,
    opponentHp,
    expression,
    handleSubmit,
    isYourTurn,
    time,
  } = useContext(Context);
  return (
    <div className="header-container">
      <div className="show-status">
        <div className="status-card">
          Your Score : {yourScore}
          <div style={{display : 'flex'}}>
            {Array.from({ length: Math.max(0, yourHp) }, (_, i) => (
              <Heart color="red" fill="red" key={i} />
            ))}
          </div>
        </div>
        {isYourTurn && <div className="status-card" style={{width : '150px',fontSize : '2rem' , textAlign : 'center'}}>{time}</div>}
        <div className="status-card">
          Opponent Score : {opponentScore}
          <div style={{display : 'flex'}}>
            {Array.from({ length: Math.max(0, opponentHp) }, () => (
              <Heart color="red" fill="red"/>
            ))}
          </div>
        </div>
      </div>
      <div className="show-expression">
        <div>
          Expression : {Array.isArray(expression) ? expression.join(" ") : ""}
        </div>
        {isYourTurn && (
          <button className="submit-btn" onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
