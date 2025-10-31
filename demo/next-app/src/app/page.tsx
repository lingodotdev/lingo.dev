/*
"use client";
"use server";

"use i18n";
*/

import { HeroTitle, HeroSubtitle, HeroActions } from "../components";
import { Playground } from "../components/Playground";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <HeroTitle />
        <HeroSubtitle />
        <HeroActions />
      </div>
      <section className="w-full max-w-5xl justify-center bg-gray-900 rounded-xl p-6 shadow-lg">
        <h3 className="text-white text-2xl font-semibold text-center mb-6">
          Try Lingo.dev Live
        </h3>
        {/* <div className="justify-items-center grid grid-cols-1 md:grid-cols-2 gap-6"> */}
        <div className="flex justify-center">
          <div className="bg-gray-800 rounded-lg overflow-hidden p-4">
            <Playground />
          </div>
        </div>
      </section>
      {/* <div>
        <Playground />
      </div> */}
    </div>
  );
}
