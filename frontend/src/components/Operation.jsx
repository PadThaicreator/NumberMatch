import { useContext } from "react";
import "../App.css";
import Context from "../Context";
import Swal from "sweetalert2";

export default function Operator({ setExpression, expression }) {
  const operators = ["+", "-", "x", "÷"];
  const parentheses = ["(", ")"];
  const { isYourTurn, setBoard, beforeBoard } = useContext(Context);

  const handleClick = (value) => {
    if (!isYourTurn) return;

    if (expression.length === 0 && !parentheses.includes(value)) return;

    const lastText = expression[expression.length - 1];

    if(parentheses.includes(value)){
       
        if(operators.includes(lastText) && value == '('){
            setExpression([...expression, value]);
            return;
        }
        
    }

    if (operators.includes(lastText)) {
      const newExpression = [...expression];
      newExpression[newExpression.length - 1] = value;
      setExpression(newExpression);
      return;
    }

    setExpression([...expression, value]);
  };

  const handleClear = () => {
    setExpression([]);
    setBoard(beforeBoard);
  };

  return (
    <div>
      {operators.map((item, index) => (
        <button
          key={index}
          className="operator-card"
          onClick={() => handleClick(item)}
        >
          {item}
        </button>
      ))}

      {parentheses.map((item, index) => (
        <button
          key={index}
          className="operator-card"
          style={{ backgroundColor: "green" }}
          onClick={() => handleClick(item)}
        >
          {item}
        </button>
      ))}
      <button
        className="operator-card"
        style={{ backgroundColor: "#e96565ff" }}
        onClick={handleClear}
      >
        C
      </button>
    </div>
  );
}
