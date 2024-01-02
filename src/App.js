import React from 'react';
import Login from "./Components/Login";
import Register from "./Components/Register";
import Game from './Components/Game';  // 게임 컴포넌트
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

function App() {
  // let user = useSelector((state) => {return state.user});

  axios.defaults.withCredentials = true;
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/game' element={<Game/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
    </Router>
  );
}

export default App;
