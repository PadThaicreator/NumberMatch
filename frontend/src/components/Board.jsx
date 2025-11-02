import Cell from "./Cell";
import "../App.css"
export default function Board({setBoard , setTotal , total , boardValue , board , setExpression,expression , setExpressionIndex , expressionIndex}) {
  const numRow = [0,1,2,3,4,5,6,7,8,9];



  return (
    <div className="board">
      {numRow.map((col )=>(
        <div key={`col-${col}`}>
            {numRow.map((row)=>(
                <Cell key={`cell-${row}-${col}`} row={row} col={col} setBoard={setBoard} setTotal={setTotal} total={total} boardValue={boardValue} board={board} setExpression={setExpression} expression={expression} setExpressionIndex={setExpressionIndex} expressionIndex={expressionIndex}/>
            ))}
        </div>
      ))}
    </div>
  );
}
