import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { questions } from "../data/Question"
import ProgressBar from "../components/ProgressBar"
import QuestionCard from "../components/QuestionCard"

export default function Quiz() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)

  function handleAnswer(value) {
    const newScore = score + value
    setScore(newScore)

    if (index + 1 < questions.length) {
      setIndex(index + 1)
    } else {
      localStorage.setItem("emotion-score", newScore)
      navigate("/result")
    }
  }

  return (
    <div className="h-screen flex items-baseline py-5 justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <ProgressBar current={index + 1} total={questions.length} />
        <QuestionCard
          question={questions[index]}
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  )
}
