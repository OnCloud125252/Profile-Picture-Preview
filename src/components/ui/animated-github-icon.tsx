"use client";

import Lottie from "react-lottie-player/dist/LottiePlayerLight";
import animationData from "@/public/lottie/github_icon_animation.json";

export default function AnimatedGitHubIcon() {
  return (
    <a
      href="https://github.com/OnCloud125252/Profile-Picture-Preview"
      target="_blank"
      rel="noopener"
      className="h-8 w-8 sm:h-9 sm:w-9 hover:w-[calc(100%)] duration-[400ms] transition-all flex items-center border border-zinc-400 bg-gray-200 hover:bg-gray-100 rounded-full overflow-hidden text-zinc-900"
    >
      <div className="flex items-center text-nowrap">
        <Lottie
          animationData={animationData}
          speed={0.7}
          play
          loop
          className="w-7 h-7 sm:w-8 sm:h-8 -mt-[0.16rem] ml-[0.075rem] mr-[0.19rem]"
        />
        <p>Visit repository</p>
        <span className="-mt-[0.18rem] mx-[0.1rem]">@</span>
        <p className="mr-2">GitHub</p>
      </div>
    </a>
  );
}
