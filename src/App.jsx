<<<<<<< HEAD
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
=======
import { Toaster } from "react-hot-toast";
import FileMerger from "./component/FileMerger";
import ExcelResellerFilter from "./component/GPO2CFILTER";

function App() {
  return (
    <main className="bg-black">
      <section className="container bg-purple-300 min-h-screen mx-auto">
        <header>
          {/* <h1 className="text-3xl text-center uppercase font-bold py-10">
            You can merge Your csv , xls, xlsx files here
          </h1>
          <a
            href="../GPO2CFILTER.html"
            className="fixed top-5 right-20 font-semibold text-red-500"
          >
            GP O2C Filter
          </a>
          <div>
            <FileMerger />
          </div> */}

          <ExcelResellerFilter />
        </header>
      </section>
      <Toaster />
    </main>
>>>>>>> 44498f7fcba3b26c6575b99d5ad0ced5e28f1865
  );
}

export default App;
