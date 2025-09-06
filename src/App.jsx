import { useNavigate } from "react-router"

export default function App() {
const navigate = useNavigate()
  return <div>
    <h1>Just another board :D</h1>
    <button onClick={() => {
      navigate('/board')
    }}>
        Go to board
        <span> 🚀</span>
    </button>
  </div>
}