import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Header from './components/Header';
import ThreeScene from './components/ThreeScene';

function App() {
  return (
    <Router>
      <Header/>
      <Routes>
      </Routes>
      <ThreeScene />
    </Router>
  )
}

export default App
