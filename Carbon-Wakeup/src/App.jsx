import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FrontPage from './frontpage';
import AboutUs from './AboutUs';
import Compare from './Compare.jsx';
import Calculator from './Calculator.jsx';
import Donate from './Donate.jsx';
import Login from './Login.jsx';

function App() {
  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
