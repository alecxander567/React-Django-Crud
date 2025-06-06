import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Landingpage from './Components/Landingpage.jsx';
import Homepage from './Components/Homepage.jsx';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/Homepage" element={<Homepage />} />
      </Routes>
    </Router>
  )
}

export default App
