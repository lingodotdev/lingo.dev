import { useNavigate } from "react-router-dom";
import { toggleLoginScreen } from "../redux/slices/navSlice";
import { useDispatch } from "react-redux";


export default function Home() {

  const dispatch = useDispatch();
  const Navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-100 ">
      
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-6 py-10">
        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          Where Conversations <span className="text-emerald-600">Bloom</span>
        </h2>

        <p className="mt-6 max-w-xl text-lg text-gray-600">
            Bloom is a safe space for moments when life feels heavy.
            Talk openly with supportive people or a caring AI — anonymously,
            without judgment, and at your own pace.
        </p>

        <div className="mt-10 flex gap-4">
          <button
            onClick={() => {
              dispatch(toggleLoginScreen());
            }}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Get Started
          </button>
          <button
            onClick={() => {
              Navigate("/about");
            }}
            className="px-6 py-3 border border-emerald-600 text-emerald-700 rounded-lg hover:bg-emerald-50 transition"
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 md:px-12 py-10">
        <h3 className="text-3xl font-bold text-center text-gray-900">
          Why Bloom?
        </h3>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 ">
            <h4 className="text-xl font-semibold text-emerald-600">
              Instant Matching
            </h4>
            <p className="mt-2 text-gray-600">
              Connect with people instantly based on shared interests.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
            <h4 className="text-xl font-semibold text-emerald-600">
              Real-Time Chat
            </h4>
            <p className="mt-2 text-gray-600">
              Smooth, fast, and seamless conversations anytime.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
            <h4 className="text-xl font-semibold text-emerald-600">
              Safe & Secure
            </h4>
            <p className="mt-2 text-gray-600">
              Privacy-first design with secure communication.
            </p>
          </div>
        </div>
      </section>

      <div className="min-h-screen px-6 py-16">

      {/* Header */}
      <section className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          About <span className="text-emerald-600">Bloom</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 leading-relaxed">
          Bloom was created for moments when words feel heavy,
          thoughts feel crowded, and silence feels louder than it should.
        </p>
      </section>

      {/* Mission */}
      <section className="max-w-5xl mx-auto mt-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">
            Our Mission
          </h2>

          <p className="mt-4 text-gray-600 leading-relaxed">
            We believe everyone deserves a safe space to talk —
            without fear of judgment, labels, or expectations.
          </p>

          <p className="mt-4 text-gray-600 leading-relaxed">
            Bloom helps you connect with supportive people or a caring AI,
            anonymously and at your own pace — whether you want to vent,
            reflect, or simply feel heard.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">
          <p className="text-emerald-600 font-medium text-lg">
            “You don’t need to have the right words.  
            You just need a space where you’re allowed to feel.”
          </p>
        </div>
      </section>

      {/* Why Bloom Exists */}
      <section className="max-w-6xl mx-auto mt-24">
        <h2 className="text-3xl font-semibold text-center text-gray-900">
          Why Bloom Exists
        </h2>

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold text-emerald-600">
              Emotional Safety
            </h3>
            <p className="mt-3 text-gray-600">
              No profiles, no pressure. Just honest conversations in a space
              designed to feel calm and supportive.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold text-emerald-600">
              Human Connection
            </h3>
            <p className="mt-3 text-gray-600">
              Connect with people who understand what you’re going through —
              based on shared emotions, not appearances.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold text-emerald-600">
              Care at Your Pace
            </h3>
            <p className="mt-3 text-gray-600">
              Whether it’s a real person or an AI companion,
              Bloom meets you where you are — gently.
            </p>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="max-w-4xl mx-auto mt-24 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
          You’re not alone — even when it feels like it.
        </h2>

        <p className="mt-4 text-gray-600">
          Bloom isn’t here to fix you.  
          It’s here to sit with you, listen, and remind you that
          your feelings matter.
        </p>
      </section>

      <footer className="pt-11 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Bloom. All rights reserved.
      </footer>

    </div>

      {/* Footer */}
      
    </div>
  );
}
