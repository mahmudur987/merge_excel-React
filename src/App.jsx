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
  );
}

export default App;
