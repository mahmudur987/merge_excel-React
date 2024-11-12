import { Toaster } from "react-hot-toast";
import FileMerger from "./component/FileMerger";

function App() {
  return (
    <main className="container bg-purple-300 min-h-screen mx-auto">
      <header>
        <h1 className="text-3xl text-center uppercase font-bold py-10">
          You can merge Your csv , xls, xlsx files here
        </h1>

        <div>
          <FileMerger />
        </div>
      </header>
      <Toaster />
    </main>
  );
}

export default App;
