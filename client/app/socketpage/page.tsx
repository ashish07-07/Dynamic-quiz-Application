"use client";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { motion, useScroll } from "framer-motion";
import { useRouter } from "next/navigation";
// Import framer-motion

export default function Socketre() {
  //  const [useranswer, setusernaswer] = useState<number | null>(null);
  // const [useranswer, setusernaswer] = useState<number | null>(null);
  const [useranswer, setusernaswer] = useState<string>("");
  const [waitnoti, setwaitingnoti] = useState<string | null>(null);

  const [waitnotification, setwaitnotification] = useState<Boolean | string>(
    false
  );

  const [cursockid, setcursockid] = useState<Socket | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [question, setcurrentquestion] = useState<string | null>(null);
  const currentq = useRef<string | null>(null);
  const currentquestionwinner = useRef<string | null>(null);

  const [gameovernoti, setgameover] = useState<string | null>(null);

  const [gameovernotification, setgameovernotification] =
    useState<Boolean>(false);

  const [gamestartaware, setgameaware] = useState<Boolean>(false);

  interface Winner {
    correctusername: string;
  }
  interface Gameover {
    message: string;
  }
  const [cqwinner, setcqwinner] = useState<string | null>(null);
  const [newround, setnewround] = useState<Boolean | null>(null);

  const [newquizround, setnewquizround] = useState<Boolean>(false);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session || !session.user) {
      console.log("Not logged in, redirecting...");
      router.push("/authsigninpage");
      return;
    }
    const socket = io("http://localhost:3000");

    console.log(socket);

    setcursockid(socket);

    socket.on("connect", () => {
      console.log("hi from frontend ");
    });

    socket.on("newquestion", (questionformat) => {
      console.log("Received new question:", questionformat.question);
      console.log("Question details:", questionformat);

      setcurrentquestion(questionformat.question);
      currentq.current = questionformat.question;
      setwaitnotification(false);
      setgameaware(false);
      setcqwinner("");
    });

    socket.on("answerrecieved", (message: Winner) => {
      console.log(message);
      console.log(message.correctusername);
      console.log("i am inside the users  correct answer page");
      currentquestionwinner.current = message.correctusername;
      setcqwinner(message.correctusername);
    });

    socket.on("gamestartaware", function ({ mes }) {
      console.log("the game will be started in 2 seconds");
      setgameaware(true);
      setgameover("");
    });

    socket.on("waitre", function (message) {
      console.log("wait for sometime as new user is not connected");
      setwaitingnoti(message);
      setwaitnotification(true);
    });

    socket.on("gameOver", function ({ message }: Gameover) {
      console.log(message);
      setgameover(message);
      console.log("game over guys");
      setnewround(true);

      setgameovernotification(true);

      setnewquizround(true);
      setcqwinner(""); // OVER HERE I HAVE ADDED //

      currentq.current = " "; // here i have

      setcurrentquestion(" ");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  function Handleinput() {
    console.log("setting the correct state with answer");
    if (!cursockid) {
      return;
    }
    if (!session?.user) {
      return;
    }

    console.log(`the user entered number is ${useranswer}`);
    cursockid.emit("answers", {
      answer: parseInt(useranswer),
      userId: session?.user.id,
      name: session.user.name,
    });
    console.log("i have sent the answer to server");

    setusernaswer("");
    // setuserans
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-rose-900">
      <div className="grid grid-cols-2 gap-6 p-6 w-full max-w-6xl">
        <div className="border-2 border-gray-300 p-6 rounded-lg bg-black shadow-lg w-full h-full flex flex-col justify-between">
          <h2 className="text-xl font-bold mb-4 font-mono">The question is:</h2>

          <motion.h3
            className="text-lg text-white -700 mb-4"
            key={currentq.current}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* {currentq.current} */}
            {question}
          </motion.h3>

          <input
            type="text"
            className="block w-full px-4 py-2 text-black border border-gray-300 rounded-md mb-4"
            placeholder="Enter your answer"
            onChange={(e) => setusernaswer(e.target.value)}
            value={useranswer}
          />
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            onClick={Handleinput}
          >
            Submit Answer
          </button>
        </div>

        <div className="border-2 border-gray-300 p-6 rounded-lg bg-black shadow-lg w-full h-full flex flex-col justify-center">
          {gameovernoti && (
            <h2 className="text-xl font-bold text-green-300">
              Game Ending Notification: {gameovernoti}
            </h2>
          )}
          {cqwinner && (
            <h2 className="text-lg text-blue-200 border-double border-4 border-sky-500">
              Fastest 'CORRECT' Answer Is given by {cqwinner} 🎊🎊
            </h2>
          )}

          {gamestartaware && <h2>Get ready Be ready</h2>}

          {waitnotification && (
            <h2 className="text-lg text-blue-200 border-double border-4 border-sky-500">
              Wait for one more user join ashish this thinh i chnaged now{" "}
            </h2>
          )}
        </div>

        {newround && (
          <button
            className="bg-red-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg"
            onClick={function () {
              router.push("/Leaderboard");
            }}
          >
            Leader Board
          </button>
        )}

        {newquizround && (
          <button
            className="bg-red-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg"
            onClick={function () {
              cursockid?.emit("newquizround", {
                message: "start a new quiz",
              });
            }}
          >
            Start A new quiz
          </button>
        )}
      </div>
    </div>
  );
}
