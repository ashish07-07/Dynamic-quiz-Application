"use client";
import axios from "axios";
import { useEffect, useState } from "react";
// import { Waver } from "../components/wavy-background";

import { FocusCards } from "../components/focus-cards";

interface leaderboardtemplate {
  id: number;
  score: number;
  user: {
    name: string;
  };

  userId: number;
}
export default function Tabletopper() {
  const [userdetails, setleaderboarddetails] = useState<
    leaderboardtemplate[] | null
  >(null);
  useEffect(() => {
    async function Getleaderboarddetails() {
      const leaderboarddetails = await axios.get(
        "http://localhost:3000/ranking/leaderboard"
      );
      console.log(leaderboarddetails);

      setleaderboarddetails(leaderboarddetails.data.leaderboard);
    }

    Getleaderboarddetails();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r bg-customPurple p-6">
      {userdetails &&
        userdetails.map((val, index) => (
          <div key={index} className="w-full max-w-md mb-4">
            {" "}
            <div className="grid grid-cols-2 gap-6 border-solid border-2 border-white p-4 rounded-lg">
              {" "}
              <div className="font-bold text-white">Name: {val.user.name}</div>
              <div className="font-semibold text-white">
                Score Till now is: {val.score}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
