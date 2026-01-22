import { useNavigate } from "react-router-dom"

export default function NotFound() {
    const navigate =    useNavigate()
  return (
    <div className="w-full min-h-screen bg-slate-800  flex items-center justify-center flex-col">
        <h1 className="text-4xl text-white my-2 font-semibold">404</h1>
        <h2 className="text-2xl text-white my-2 font-semibold">Page Not Found</h2>
        <button onClick={() => navigate('/chat')} className="btn btn-primary my-2 btn-wide">Go To Home</button>
    </div>
  )
}
