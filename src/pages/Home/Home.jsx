import { Toaster } from "react-hot-toast";
import FileMerger from "../../component/FileMerger";

const Home = () => {
  return (
    <>
      <section className="container bg-purple-300 min-h-screen mx-auto">
        <header>
          <h1 className="text-3xl text-center uppercase font-bold py-10">
            You can merge Your csv , xls, xlsx files here
          </h1>

          <div>
            <FileMerger />
          </div>
        </header>
      </section>
      <Toaster />
    </>
  );
};

export default Home;
