import Chat from "./ui/chat"
import ListeChat from "./ui/listeChat"
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListeChat/>}/>
        <Route path="/:server" element={<Chat/>} />
      </Routes>
    </Router>
  )
}

export default App
