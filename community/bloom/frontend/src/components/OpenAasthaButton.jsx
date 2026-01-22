import { Sparkles } from "lucide-react"

export default function OpenAasthaButton() {
  const openAastha = () => {
    window.location("/chat");
  }

  return (
    <button
      onClick={openAastha}
      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-medium shadow-lg hover:bg-emerald-600 transition"
    >
      <Sparkles size={18} />
      Talk to Aastha
    </button>
  )
}
