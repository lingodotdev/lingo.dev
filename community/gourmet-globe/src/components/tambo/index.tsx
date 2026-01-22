"use client";

import Link from "next/link";
import Section from "../common/section";

export default function Tambo() {
  return (
    <Section title={<span data-lingo-skip>Tambo</span>}>
      <div className="flex flex-col gap-4">
        <p className="text-gray-600">
          Build conversational interfaces with Tambo AI
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Unauthenticated Chat */}
          <Link
            href="/tambo"
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors inline-block text-center"
          >
            Chat w/ Tambo
          </Link>

          {/* Authenticated Chat */}
          <Link
            href="/tambo/auth"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors inline-block text-center"
          >
            Chat w/ Better Auth
          </Link>
        </div>
      </div>
    </Section>
  );
}
