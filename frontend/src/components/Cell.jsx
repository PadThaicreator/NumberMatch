import { useContext, useEffect, useState } from "react";
import "../App.css";
import Context from "../Context";
import Swal from "sweetalert2";

export default function Cell({
  row,
  col,
  setBoard,
  setTotal,
  total,
  boardValue,
  board,
  expression,
  setExpression,
}) {
  const [isClick, setIsClick] = useState(board[row][col]);
  const { isYourTurn } = useContext(Context);

  useEffect(() => {
    console.log(isClick);
  }, [isClick]);
  const cellVal = board[row][col];
  useEffect(() => {
    setIsClick(cellVal);
  }, [cellVal]);

 

  const handleClick = (e) => {
    e.stopPropagation();
    if(!isYourTurn)return;
    if (isClick == -99) return;
    const nextClick = !isClick;
    const operators = ["+", "-", "x", "÷" , "(" , ")"];
    
    
    if (nextClick) {
        if(!operators.includes(expression[expression.length-1]) && expression.length > 0){
           Swal.fire({
                      title: "Worng Choose",
                      text: "Please Choose Operator",
                      icon: "warning",
                      heightAuto: false,
                      });
                      return;
        }
 
      updateCell(row, col, nextClick ? 1 : 0);
      setIsClick(nextClick);
      const valueStr = boardValue && boardValue[row] && boardValue[row][col] !== undefined ? boardValue[row][col].toString() : '';
      // alert(isClick)
      setExpression([...expression, valueStr]);
    } else {
      const valueStr = boardValue && boardValue[row] && boardValue[row][col] !== undefined ? boardValue[row][col].toString() : '';
      updateCell(row, col, nextClick ? 1 : 0);
      setIsClick(nextClick);
      let removeIndex = -1;
      for (let i = expression.length - 1; i >= 0; i--) {
        if (expression[i] === valueStr) {
          removeIndex = i;
          break;
        }
      }


      let toRemove = new Set();
      if (removeIndex >= 0) {
        toRemove.add(removeIndex);
        const prevIndex = removeIndex - 1;
        if (prevIndex >= 0 && operators.includes(expression[prevIndex])) {
          toRemove.add(prevIndex);
        }
      }
      let updated =
        toRemove.size > 0
          ? expression.filter((_, i) => !toRemove.has(i))
          : expression;
      if (
        updated.length > 0 &&
        operators.includes(updated[updated.length - 1])
      ) {
        updated = updated.slice(0, -1);
      }
      if (updated.length > 0 && operators.includes(updated[0])) {
        updated = updated.slice(1);
      }

      setExpression(updated);
      setTotal(total - (boardValue && boardValue[row] && boardValue[row][col] !== undefined ? boardValue[row][col] : 0));
    }
  };

  const updateCell = (rowIndex, colIndex, newValue) => {
    setBoard((prevBoard) =>
      prevBoard.map((row, rIndex) => {
        if (rIndex !== rowIndex) {
          return row;
        }
        const newRow = [...row];
        newRow[colIndex] = newValue;
        return newRow;
      })
    );
  };
  return (
    <div
      className="cell"
      onClick={handleClick}
      style={{ backgroundColor: isClick && !(isClick == -99) ? "red" : isClick == -99 ? "gray": "white" }}
    >
      <button onClick={handleClick} disabled={isClick}>
        {" "}
        {boardValue && boardValue[row][col] != 0 ? boardValue[row][col] : ''}
      </button>
    </div>
  );
}
