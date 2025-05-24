"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { WavyBackground } from "../components/wavy-background";

import Loading from "../loading";

export default function QuizRules() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session || !session.user) {
      console.log("came here");
      router.push("/authsigninpage");
    }
  }, [session, router]);

  if (!session || !session.user) {
    <Loading></Loading>;
  }

  console.log(session?.user);

  return (
    <WavyBackground>
      <button
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg"
        onClick={() => {
          router.push("/authsigninpage");
        }}
      >
        Signup Button
      </button>

      <div>
        <h2 className="text-3xl font-bold my-4">
          1)Quiz Contains 10 questions only
        </h2>
        <h2 className="text-3xl font-bold my-4">
          1)***Quiz starts only when Minimum 2 users are Ready to play***
        </h2>
        <h2 className="text-3xl font-bold my-4">
          2)The user who answers a question fastest and correctly will be marked
          with a point.
        </h2>
        <h2 className="text-3xl font-bold my-4">
          3)The user who scored the fastest correct answer is notified to
          everyone.
        </h2>
        <h2 className="text-3xl font-bold my-4">
          4) Immediately after someone answers the question, a new question will
          be generated.
        </h2>
        <h2 className="text-3xl font-bold my-4">
          4) There will be a timer for 20 seconds after which a new questions
          pops up
        </h2>
      </div>
      {session?.user && (
        <button
          className="bg-red-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg"
          onClick={function () {
            router.push("/socketpage");
          }}
        >
          Start Math Quiz
        </button>
      )}
    </WavyBackground>
  );
}
