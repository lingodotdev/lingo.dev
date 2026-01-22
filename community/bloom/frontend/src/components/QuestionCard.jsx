import Button from "./ui/Button";

export default function QuestionCard({ question, onAnswer }) {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <h2 className="text-xl font-semibold text-center">
        {question.text}
      </h2>

      <div className="grid gap-4">
        {question.options.map((option) => (
          <Button
            key={option.label}
            variant="outline"
            className="w-full py-6 px-4 text-left justify-start hover:scale-[1.02] transition"
            onClick={() => onAnswer(option.score)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
