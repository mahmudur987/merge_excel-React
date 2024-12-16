import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import MainLayout from "./Layouts/MainLayout";
import HeaderLess from "./pages/HeaderLess/HeaderLess";
import Duplicate from "./pages/Duplicate/Duplicate";
import LargeFiles from "./pages/LargeFiles/LargeFiles";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/headerLess" element={<HeaderLess />} />
          <Route path="/duplicates" element={<Duplicate />} />
          <Route path="/largeFiles" element={<LargeFiles />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
