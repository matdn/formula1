import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Header from './components/Header';
import EndlessRacer from './Pages/EndlessRacer/racer';

function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/game" element={<EndlessRacer />} />
      </Routes>
    </Router>
  )
}

export default App
