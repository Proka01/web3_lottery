import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import EnterLotteryPage from './Pages/EnterLotteryPage';
import FinishLotteryPage from './Pages/FinishLotteryPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<EnterLotteryPage />} ></Route>
        <Route exact path="/finishLottery" element={<FinishLotteryPage />} />
      </Routes>
    </div>
  );
}

export default App;
