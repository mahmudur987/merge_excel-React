import { useRef, useState } from "react";
import toast from "react-hot-toast";

function LargeFileMerger() {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [skipLines, setSkipLines] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [active, setActive] = useState(false);

  const handleFileChange = (e) => {
    setActive(false);
    const uploadedFiles = [...e.target.files];
    setFiles(uploadedFiles);

    if (uploadedFiles.length === 1) {
      toast.info(
        "Only one file uploaded. Please upload multiple files to merge."
      );
    }
  };

  const handleSkipLinesChange = (e) => {
    setSkipLines(parseInt(e.target.value, 10));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      return toast.error("Please select at least two files to merge.");
    }
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/merge", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        setActive(true);
      } else {
        toast.error(result.error || "Error merging files.");
      }
    } catch (error) {
      toast.error("Error connecting to the server.");
    } finally {
      setLoading(false);
    }
  };
  const handleDownload = async () => {
    setLoading1(true);
    try {
      const response = await fetch("http://localhost:3001/download", {
        method: "GET",
      });
      if (response.status === 200) {
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "MergedData.xlsx";
        link.click();
      } else {
        toast.error("Error downloading the file.");
      }
    } catch (error) {
      toast.error("Error occurred while downloading the file.");
    } finally {
      setLoading1(false);
    }
  };

  return (
    <div className="max-w-lg w-full flex flex-col border border-blue-700 p-5 mx-auto gap-8 rounded-xl py-10  bg-pink-50 my-10">
      <h2 className="text-xl font-bold font-sans uppercase bg-black text-white inline p-2 rounded-2xl text-center">
        File Merger
      </h2>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="border p-1 w-full"
        ref={fileInputRef}
      />
      <div>
        <label htmlFor="skipLines">
          Specify how many rows to ignore at the top of each file (e.g., headers
          or unnecessary info).
        </label>

        <input
          name="skipLines"
          type="number"
          placeholder="Rows to skip"
          value={skipLines}
          onChange={handleSkipLinesChange}
          className="p-2 rounded-xl"
        />
      </div>
      <button
        onClick={handleMerge}
        className="border border-black font-bold px-3 py-1 bg-red-400 text-white rounded-lg"
      >
        {loading ? "Loading..." : "Merge Files"}
      </button>
      <button
        onClick={handleDownload}
        className={`border border-black font-bold px-3 py-1 text-white rounded-lg ${
          active ? "bg-green-400" : "bg-gray-400"
        }`}
      >
        {loading1 ? "Preparing Download..." : "Download Merged File"}
      </button>
    </div>
  );
}

export default LargeFileMerger;
