let gameBoards = {}; 
let yourScore = {};
let yourHp = {}
const generateBoard = () => {
  const newBoard = [];
  for (let i = 0; i < 10; i++) {
    const row = [];
    for (let j = 0; j < 10; j++) {
      row.push(Math.floor(Math.random() * 10) + 1);
    }
    newBoard.push(row);
  }
  return newBoard;
};

export default function (io) {
  io.on("connection", (socket) => {
    // console.log(`A user connected with ID: ${socket.id}`);

    socket.on("join", ({  room }) => {
      const roomName = room || "default-room";
      const roomObj = io.sockets.adapter.rooms.get(roomName);
      console.log("RoomObj")
      console.log(roomObj)

     
      if (!gameBoards[roomName]) {
        // console.log(
        //   `No active board for room ${roomName}, creating a new one...`
        // );
        gameBoards[roomName] = generateBoard();
      }

      const numClients = roomObj ? roomObj.size : 0;

      // console.log(`Room '${roomName}' currently has ${numClients} client(s).`);

      if (numClients <= 2) {
        socket.join(roomName);
       
        // console.log(`User ${user} (${socket.id}) joined room '${roomName}'`);

        socket.emit("joinSuccess", {
          message: `Successfully joined ${roomName}`,
          room: roomName,
          board: gameBoards[roomName],
          numClients: numClients,
        });
      } else {
        // console.log(
        //   `User ${user} (${socket.id}) failed to join '${roomName}': Room is full.`
        // );

        socket.emit("joinError", {
          message: "Failed to join: The room is already full.",
        });
      }
    });

    socket.on("startGame", (data) => {
      const roomName = data?.room || "default-room";
      const room = io.sockets.adapter.rooms.get(roomName);
      if (room && room.size === 2) {
        const players = Array.from(room);

        const randomIndex = Math.floor(Math.random() * players.length);
        const startingPlayerId = players[randomIndex];

        // console.log(
        //   `Game started in room '${roomName}'. Starting player is ${startingPlayerId}`
        // );

        io.to(roomName).emit("gameStarted", { startingPlayerId });
      }
    });

    socket.on("submit", ({ board, yourScore, socketId, yourHp, room , opponentTarget }) => {
      const roomName = room || "default-room";
      // console.log(
      //   `Received submit from ${socketId} with score: ${yourScore} in room: ${roomName}`
      // );
      const roomObj = io.sockets.adapter.rooms.get(roomName);
      if (!roomObj) {
        console.warn(
          `submit: room '${roomName}' not found (maybe clients left). Ignoring submit from ${socketId}`
        );
        return;
      }
      const players = Array.from(roomObj).filter((data) => data != socketId);
      if (!players || players.length === 0) {
        console.warn(
          `submit: no opponent found in room '${roomName}' for submit from ${socketId}`
        );
        return;
      }

      const newboard = board.map((row) => {
        return row.map((cell) => {
          if (cell === 1) {
            return -99;
          } else {
            return cell;
          }
        });
      });

      // console.log("Sending yourTurn to player:", players[0]);
      // console.log("Board data:", newboard);

      io.to(players[0]).emit("yourTurn", {
        opponentScore: yourScore,
        board: newboard,
        opponentHp: yourHp,
        opponentTarget : opponentTarget
      });
    });


    socket.on("restartGame", ({room , isExit = false}) => {
      const roomName = room || "default-room";
      const rooms = io.sockets.adapter.rooms.get(roomName);

      if (!rooms) {
        return;
      }

      const players = Array.from(rooms);
      const winner = Array.from(rooms).filter((data) => data != socket.id);
      


      console.log(
        `User with ID: ${socket.id} restarting game in room: ${roomName}`
      );
      

     
      
        console.log("Players Here")
        console.log(isExit)
        delete gameBoards[roomName];

        
        players.forEach( player => {
          socket.leave(roomName);
          io.to(player).emit("goHome" , {socketId : winner , isExit : isExit});
        })
        
      
      
    });

    socket.on("disconnect", () => {
      // console.log(`User with ID: ${socket.id} disconnected`);

      
      const rooms = Array.from(socket.rooms);

      rooms.forEach((roomName) => {
        if (roomName !== socket.id) {
        
          const room = io.sockets.adapter.rooms.get(roomName);
          // console.log(`Socket left room: ${roomName}`);

         
          if (!room || room.size === 0) {
            delete gameBoards[roomName];
          
          }
        }
      });
    });
  });
}
