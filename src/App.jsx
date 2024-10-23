import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './page/Login';
import Home from "./page/Home";

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route exact path = '/' element = {<Login />} />
                    <Route path = '/admin' element = {<Home />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;