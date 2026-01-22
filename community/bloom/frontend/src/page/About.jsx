import React from "react";
import { useNavigate } from "react-router-dom";

const About = () => {

    const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100">

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
          A Safer Way to <span className="text-emerald-600">Talk</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Bloom is a gentle space for moments when life feels heavy.
          No pressure. No judgment. Just conversation — at your pace.
        </p>
      </section>

      {/* What is Bloom */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">
          What is Bloom?
        </h2>

        <p className="text-gray-600 text-lg leading-relaxed">
          Bloom is a supportive conversation platform where you can talk openly
          and anonymously — with a caring AI or another person who’s simply here
          to listen. No profiles. No performance. Just space to breathe.
        </p>
      </section>

      {/* How Bloom Helps (no cards) */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-semibold text-gray-900 text-center mb-16">
          How Bloom Helps
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          <Feature title="Instant Matching" desc="Connect quickly with someone aligned to how you feel." />
          <Feature title="Real-Time Chat" desc="Conversations that feel present, natural, and human." />
          <Feature title="Privacy First" desc="Anonymous by design. Your space stays yours." />
          <Feature title="Emotional Awareness" desc="Gentle questions guide conversations with care." />
        </div>
      </section>

          {/* When Should You Use Bloom */}
          <section className="max-w-3xl mx-auto px-6 py-24 text-center">

              <h2 className="text-3xl font-semibold text-gray-900 mb-8">
                  When Should You Use Bloom?
              </h2>

              <ul className="space-y-4 text-gray-600 text-lg leading-relaxed">
                  <li>When your thoughts feel heavy</li>
                  <li>When you want to talk but don’t know who to reach out to</li>
                  <li>When you need comfort, not solutions</li>
                  <li>When you just want to be heard</li>
              </ul>

          </section>


      {/* Mission */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">
          Our Mission
        </h2>

        <p className="text-gray-600 text-lg leading-relaxed">
          Emotional support should be accessible, human,
          and pressure-free. Bloom exists to remind you —
          you don’t have to carry everything alone.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center pb-32">
        <button 
            onClick={() => {
                navigate("/");
            }}
            className="px-10 py-3 rounded-xl bg-emerald-600 text-white text-lg font-medium hover:bg-emerald-700 transition"
        >
          let's bloom together
        </button>
      </section>

    </div>
  );
};

function Feature({ title, desc }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-emerald-700 mb-3">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

export default About;
