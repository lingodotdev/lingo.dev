import axios from "axios"
import { useNavigate } from "react-router-dom"
import { getEmotionLevel } from "../utils/emotion"
import { useEffect } from "react"
import { useSelector } from "react-redux";

export default function Result() {
  const navigate = useNavigate()
  const score = Number(localStorage.getItem("emotion-score"))
  const level = getEmotionLevel(score)
  const user = useSelector((state) => state.nav.user);


  // console.log(score);
  // console.log(user.uid);
  // console.log(level);

  useEffect(() => {
    const saveScore = async () => {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/user/set-score`,
          {
            uid: user.uid,
            emotionalScore: score,
            emotionalTag: level
          }
        )
      } catch (error) {
        console.error("Error saving emotion score:", error)
      }
    }
    
    saveScore();
  }, [score, level, user.uid])
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 px-4 pb-24">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center space-y-6 w-full max-w-md">
        
        <h1 className="text-2xl font-bold">Your Result</h1>

        <div className="space-y-2">
          <p className="text-lg">Score: {score}</p>
          <p className="text-xl font-semibold text-emerald-600">
            {level}
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/match")}
            className="w-full h-12 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
          >
            Talk to Someone
          </button>

          <button
            onClick={() => navigate("/chat")}
            className="w-full h-12 rounded-xl border border-slate-300 text-slate-800 font-medium hover:bg-slate-100 transition"
          >
            Talk to Aastha
          </button>
        </div>

      </div>
    </div>
  )
}

