import express from "express";
import http from "http";
import { Server } from "socket.io";
import { Generatequiz } from "./allfunctions/Generatequixfunction";
import prisma from "./db";

import userlogin from "./routes/Userregister";
import userleaderboard from "./routes/leaderboard";
let questionCount = 0;
let currentquestioncount = 0;
let answerReceived = false;
let correctanswer: number | null;
let gameOver = false;

const app = express();

app.use(express.json());

app.use("/ranking", userleaderboard);

const server = http.createServer(app);

let usercount = new Map();

let roundTimer: NodeJS.Timeout | null = null;

app.use("/user", userlogin);

function Startnewround() {
  answerReceived = false;
  gameOver = false;

  if (usercount.size >= 2) {
    if (currentquestioncount < 4) {
      io.emit("gamestartaware", {
        message: "Gameover notification",
      });
      setTimeout(() => {
        currentquestioncount++;
        const questionformat = Generatequiz();
        let questionformatre = `${questionformat.num1} ${questionformat.operator}${questionformat.num2}`;
        correctanswer = eval(questionformatre);

        console.log(`The answer is ${correctanswer}`);

        console.log("New question generated:", questionformat);

        io.emit("newquestion", questionformat);

        if (roundTimer) clearTimeout(roundTimer);

        roundTimer = setTimeout(() => {
          console.log("The timer is up.");
          io.emit("timeup", "No correct answers! Moving to NEXT ROUND.");

          if (currentquestioncount < 4) {
            Startnewround();
          } else {
            console.log("Ending the game. Game over!");

            // io.emit("gameOver", "Game over! No more questions.");
            io.emit("gameOver", {
              message: "Game Over",
            });
            gameOver = true;

            if (roundTimer) clearTimeout(roundTimer);
          }
        }, 20000);
      }, 2000);
    } else {
      // io.emit("gameOver", "Game over! No more questions.");
      console.log("choota bheem dekno jau");
      io.emit("gameOver", {
        message: "Game Over",
      });
      gameOver = true;
    }
  } else {
    io.emit("waitre", "Wait for a minimum of two users to start the round.");
  }
}

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3001"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  usercount.set(socket.id, true);

  try {
    if (usercount.size >= 2) {
      if (roundTimer) clearTimeout(roundTimer);
      Startnewround();
    } else {
      io.emit(
        "waitre",
        "Wait till more participants join to start the competitive quiz."
      );
    }
    interface Answerdata {
      answer: number;
      userId: string;
      name: string;
    }

    socket.on("answers", async function ({ answer, userId, name }: Answerdata) {
      if (gameOver) {
        console.log("Game is over, no more answers are accepted.");
        return;
      }
      console.log("the user have given the answer");
      console.log(
        `the answer I received is ${answer} and the correct answer is ${correctanswer}`
      );

      const parsedUserId = parseInt(userId, 10);

      try {
        if (!answerReceived && answer === correctanswer) {
          answerReceived = true;
          io.emit(
            "answerrecieved",

            // `Well done, guys! We got the first person who gave the correct answer is ${name}`
            {
              correctusername: name,
            }
          );

          socket.emit(
            "you gave the correct answer",
            "congrajulation u gave the correct answer"
          );

          const existingScore = await prisma.score.findUnique({
            where: { userId: parsedUserId },
          });

          if (existingScore) {
            await prisma.score.update({
              where: { id: existingScore.id },
              data: { score: { increment: 1 } },
            });
          } else {
            await prisma.score.create({
              data: {
                userId: parsedUserId,
                score: 1,
              },
            });
          }

          if (roundTimer) clearTimeout(roundTimer);

          Startnewround();
        } else {
          console.log("The answer is wrong.");
        }
      } catch (e) {
        console.log(e);
      }
    });
  } catch (e) {
    console.log(e);
  }

  socket.on("newquizround", function () {
    (currentquestioncount = 0), (answerReceived = false);
    gameOver = false;

    io.emit("someonestartedanewquiz", {
      message: "some one wants to play a new round along with u all",
    });

    if (roundTimer) clearTimeout(roundTimer);

    Startnewround();
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    usercount.delete(socket.id);

    if (usercount.size < 2) {
      if (roundTimer) {
        clearTimeout(roundTimer);
        roundTimer = null;
      }
      io.emit("stopQuiz", "Not enough users. Waiting for more participants...");
    }
  });
});

server.listen(3000, () => {
  console.log("WebSocket server listening on port 3000");
});
