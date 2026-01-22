import { useNavigate } from "react-router-dom"

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-10 mb-40 text-center">

        {/* Header */}
        <h1 className="text-4xl font-bold text-emerald-700 mb-3">
          Welcome to Bloom 🌱
        </h1>

        <p className="text-slate-600 text-lg mb-2">
          You're all set!
        </p>

        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          To personalize your experience and help us understand you better,
          we recommend starting with a short quiz.
        </p>

        {/* Primary Action */}
        <button
          onClick={() => navigate("/quiz")}
          className="w-full py-4 text-lg font-semibold rounded-2xl 
                     bg-gradient-to-r from-emerald-600 to-teal-500
                     text-white hover:shadow-lg hover:scale-[1.02]
                     transition-all duration-200"
        >
          Take the Quiz 🎯
        </button>

        {/* Secondary Action */}
        <button
          onClick={() => navigate("/chat")}
          className="w-full mt-4 py-3 rounded-xl border
                     border-emerald-600 text-emerald-700
                     hover:bg-emerald-50 transition"
        >
          Skip for now → Go to Chat
        </button>

        {/* Footer note */}
        <p className="mt-6 text-xs text-slate-400 ">
          Gentle reminders: you are worthy. 🌞
        </p>
      </div>
    </div>
  )
}
