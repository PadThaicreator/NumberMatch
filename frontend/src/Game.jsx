import { useEffect, useRef, useState } from "react";
import Board from "./components/Board.jsx";
import SideBar from "./components/SideBar.jsx";
import socket from "./socket.tsx";
import Operator from "./components/Operation.jsx";
import Context from "./Context.jsx";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import { checkSolution } from "./checkValue.js";

export default function GamePage() {
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [boardValue, setBoardValue] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const timeSet = 10;
  const winCount = localStorage.getItem("winCount") || 0
  const [total, setTotal] = useState(0);
  const [target, setTarget] = useState(Math.floor(Math.random() * 20) + 1);
  const [beforeBoard, setBeforeBoard] = useState(board);
  // const [beforeBoardValue, setBeforeBoardValue] = useState([]);

  // const [turn, setTurn] = useState();
  const [isYourTurn, setIsYourTurn] = useState(false);
  const [yourScore, setYourScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [expression, setExpression] = useState([]);
  const [expressionIndex, setExpressionIndex] = useState();
  const [isOperator, setIsOperator] = useState(false);
  const [yourHp, setYourHp] = useState(3);
  const [opponentHp, setOpponentHp] = useState(3);
  
  // const [opponentTarget , setOpponentTarget] = useState()

  const opponentTargetRef = useRef();
  const [time, setTime] = useState();

  const navigate = useNavigate();
  const location = useLocation();
  const roomName = location.state?.gameRoom || "default-room";

  const compareScoreAndShowResult = (yourScore, opponentScore) => {
    if (yourScore > opponentScore) {
      localStorage.setItem("winCount" , Number(winCount)+1)
      Swal.fire({
        title: "You Win!",
        text: `Your Socre ${yourScore} - Opponent Score ${opponentScore}`,
        icon: "success",
        heightAuto: false,
      }).then((result) => {
        if (result.isConfirmed) {
          socket.emit("restartGame", { room: roomName });
          navigate("/");
        }
      });
    } else if (yourScore < opponentScore) {
      Swal.fire({
        title: "You Lose",
        text: `Your Socre ${yourScore} - Opponent Score ${opponentScore}`,
        icon: "error",
        heightAuto: false,
      }).then((result) => {
        if (result.isConfirmed) {
          socket.emit("restartGame", { room: roomName });
          navigate("/");
        }
      });
    } else {
      Swal.fire({
        title: "Draw!",
        text: `Your Socre ${yourScore} - Opponent Score ${opponentScore}`,
        icon: "info",
        heightAuto: false,
      }).then((result) => {
        if (result.isConfirmed) {
          socket.emit("restartGame", { room: roomName });
          navigate("/");
        }
      });
    }
  };

  
  useEffect(() => {
    if (typeof time !== "number") return;
    if (!isYourTurn) return;
    if (yourHp <= 0 || opponentHp <= 0) return;

    if (time <= 0) {
      console.log("Time's up! Submitting turn...");
      setIsYourTurn(false);
      Swal.fire({
        title: "Time Out",
        text: "Waiting for your turn",
        icon: "error",
        heightAuto: false,
      });
      setYourHp(yourHp - 1);
      let num = Math.floor(Math.random() * 20) + 1;
      socket.emit("submit", {
        board: beforeBoard,
        yourScore: yourScore,
        socketId: socket.id,
        yourHp: yourHp - 1,
        room: roomName,
        opponenTarget: num,
      });
      setTotal(0);
      setBoard(beforeBoard);
      setTarget(num);
      setExpression([]);
      return;
    }

    const timeOut = setTimeout(() => setTime((t) => t - 1), 1000);
    return () => clearTimeout(timeOut);
  }, [time, isYourTurn, yourHp, opponentHp]);

  useEffect(() => {
    if (yourHp == 0) {
      Swal.fire({
        title: "Your Lose",
        text: "Nice Try",
        icon: "error",
        heightAuto: false,
      }).then((result) => {
        if (result.isConfirmed) {
          // alert("ASDASD")

          socket.emit("restartGame", { room: roomName });
          // navigate("/");
        }
      });
    }
  }, [yourHp]);

  useEffect(() => {
    console.log(boardValue);
  }, [boardValue]);

  useEffect(() => {
    if (opponentHp == 0) {
      localStorage.setItem("winCount" , Number(winCount)+1)
      Swal.fire({
        title: "Your Win",
        text: "So Good",
        icon: "success",
        heightAuto: false,
      }).then((result) => {
        if (result.isConfirmed) {
          // alert("ASDASD")

          socket.emit("restartGame", { room: roomName });
          // navigate("/");
        }
      });
    }
  }, [opponentHp]);
  useEffect(() => {
  
    socket.on("connect", () => {
    
      socket.emit("join", { room: roomName });
    });

    
    if (socket.connected) {
     
      socket.emit("join", { user: "Me", room: roomName });
    }

    socket.on("joinSuccess", (data) => {
      console.log(data.message);
      // alert(data.message)
      setBoardValue(data.board);
      // setBeforeBoardValue(data.board);
      //   alert(data.numClients)
      if (data.numClients == 2) {
        socket.emit("startGame", { room: roomName });
      }
    });

    socket.on("gameStarted", ({ startingPlayerId }) => {
      if (socket.id === startingPlayerId) {
        // setTurn(startingPlayerId);
        setIsYourTurn(true);
        Swal.fire({
          title: "Game Started",
          text: "Let's Play",
          icon: "success",

          heightAuto: false,
        }).then((result) => {
          if (result.isConfirmed) setTime(timeSet);
        });
      } else {
        setIsYourTurn(false);
        Swal.fire({
          title: "Game Started",
          text: "Let's Play",
          icon: "success",
          heightAuto: false,
        });
      }

      setBeforeBoard(board);
    });

    socket.on("yourTurn", async (data) => {
      console.log("Received yourTurn event:", data);
      console.log("Received board from opponent:", data.board);

      setBoard(data.board);
      setBeforeBoard(data.board);
      opponentTargetRef.current = data.opponentTarget;
      // console.log("OpponentTarget : " + data.opponentTarget)

      setBoardValue((prevBoardValue) => {
        const updatedBoardValue = prevBoardValue.map((row, rowIdx) =>
          row.map((val, colIdx) => {
            if (data.board[rowIdx][colIdx] == -99) {
              return 0;
            }
            return val;
          })
        );

        // console.log("Updated boardValue ", updatedBoardValue);

        const hasSolution = checkSolution(updatedBoardValue, target);

        if (hasSolution) {
          setOpponentScore(data.opponentScore);
          setOpponentHp(data.opponentHp);
          setTime(timeSet);
          setIsYourTurn(true);
        } else {
          setOpponentScore(data.opponentScore);
          setYourScore((currentYourScore) => {
            compareScoreAndShowResult(currentYourScore, data.opponentScore);
            return currentYourScore;
          });
        }

        return updatedBoardValue;
      });
    });

    socket.on("joinError", (data) => {
      console.error(data.message);
      alert(data.message);
      navigate("/");
    });

    socket.on("goHome", (data) => {
      
      if (socket.id == data.socketId && data.isExit) {
        localStorage.setItem("winCount" , Number(winCount)+1)
        Swal.fire({
          title: "Your Win",
          text: "Your opponent left the game",
          icon: "success",
          heightAuto: false,
        });
      }
      // alert("GO BACK")
      navigate("/");
    });

    return () => {
      socket.off("connect");
      socket.off("joinSuccess");
      socket.off("joinError");
      socket.off("gameStarted");
      socket.off("yourTurn");
      socket.off("goHome");
    };
  }, []);
  const countParentheses = () => {
    let openCount = 0;
    let closeCount = 0;
    expression.forEach((item) => {
      if (item === "(") openCount++;
      if (item === ")") closeCount++;
    });
    return { openCount, closeCount, unmatched: openCount - closeCount };
  };

  const handleSubmit = () => {
    const value = expression
      .toString()
      .replaceAll(",", "")
      .replaceAll("x", "*")
      .replaceAll("÷", "/");
    const parenthesesCount = countParentheses();
    if (parenthesesCount.unmatched !== 0) {
      Swal.fire({
        title: "Unmatched Parentheses",
        text: "Please check your parentheses",
        icon: "warning",
        heightAuto: false,
      });
      setExpression([]);
      setBoard(beforeBoard);
      return;
    }

    let result;
    try {
      result = eval(value);

      if (isNaN(result) || !isFinite(result)) {
        Swal.fire({
          title: "Invalid Expression",
          text: "Please check your expression",
          icon: "warning",
          heightAuto: false,
        });
        setExpression([]);
        setBoard(beforeBoard);
        return;
      }
    } catch (error) {
      Swal.fire({
        title: "Invalid Expression",
        text: `Syntax Error: ${error.message}`,
        icon: "error",
        heightAuto: false,
      });
      setExpression([]);
      setBoard(beforeBoard);
      return;
    }

    if (target != result) {
      // alert("Not Equal");
      Swal.fire({
        title: "Not Equal Target",
        text: "Choose Again",
        icon: "warning",
        heightAuto: false,
      });

      setBoard(beforeBoard);
      setExpression([]);
    } else {
      //   alert(" Equal");
      const score = 5;
      const newScore = yourScore + score;
     
      setYourScore(newScore);
      setIsYourTurn(false);

      const updatedBoardValue = boardValue.map((row, rowIdx) =>
        row.map((val, colIdx) => {
          if (board[rowIdx][colIdx] == 1) {
            return 0;
          }
          return val;
        })
      );

      setBoardValue(updatedBoardValue);

      let num = Math.floor(Math.random() * 20) + 1;

      socket.emit("submit", {
        board: board,
        yourScore: newScore,
        socketId: socket.id,
        yourHp: yourHp,
        room: roomName,
        opponentTarget: num,
      });

      // console.log(updatedBoardValue);
      setTotal(0);
      setTime(-1);
      setTarget(num);
      setExpression([]);

      console.log("OpponentTarget : " + opponentTargetRef.current);
      if (!opponentTargetRef.current) return;

      console.log("In HandleSubmit");
      const hasSolution = checkSolution(
        updatedBoardValue,
        opponentTargetRef.current
      );
      console.log("OpponentTarget : " + opponentTargetRef.current);
      if (!hasSolution) {
        compareScoreAndShowResult(newScore, opponentScore);
      }
    }
  };

  const ContextValue = {
    isOperator,
    setIsOperator,
    isYourTurn,
    yourHp,
    opponentHp,
    yourScore,
    opponentScore,
    target,
    expression,
    handleSubmit,
    time,
    setExpression,
    setBoard,
    beforeBoard,
    roomName,
  };

  return (
    <Context.Provider value={ContextValue}>
      <Header />
      <div className="container-game">
        <SideBar />

        <div style={{ display: "flex", gap: "1rem" }}>
          <Board
            setBoard={setBoard}
            setTotal={setTotal}
            total={total}
            boardValue={boardValue}
            board={board}
            setExpression={setExpression}
            expression={expression}
            setExpressionIndex={setExpressionIndex}
            expressionIndex={expressionIndex}
          />
          <Operator setExpression={setExpression} expression={expression} />
        </div>
      </div>
    </Context.Provider>
  );
}
