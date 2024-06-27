import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Header from './components/Header';
import EndlessRacer from './Pages/EndlessRacer/racer';
import RaceScene from './components/RaceScene';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/game" element={<EndlessRacer />} />
        <Route path="/gamePlay" element={<RaceScene />} />
       
      </Routes>
    </Router>
  )
}

export default App;
export default App;
