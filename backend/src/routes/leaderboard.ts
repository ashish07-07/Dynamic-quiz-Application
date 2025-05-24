import express from "express";

const route = express.Router();
import prisma from "../db";

route.get("/leaderboard", async function (req: any, res: any) {
  const leaderboard = await prisma.score.findMany({
    orderBy: {
      score: "desc",
    },

    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  res.set("Access-Control-Allow-Origin", "http://localhost:3001");

  return res.status(201).json({
    leaderboard,
  });
});

export default route;
