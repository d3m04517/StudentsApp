import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// Modules
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Components
import Students from './components/students.component';

function App() {
  return (
    <div className="App" style={{backgroundColor: 'lightgrey', display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh'}}>
      <Router>
        <Route path="/" component={Students} />
      </Router>
    </div>
  );
}

export default App;
