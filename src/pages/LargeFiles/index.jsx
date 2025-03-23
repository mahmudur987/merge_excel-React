import { useRef, useState } from "react";
import toast from "react-hot-toast";

function LargeFileMerger() {
  const fileInputRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [skipLines, setSkipLines] = useState(0);
  const [isMerging, setIsMerging] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const handleFileChange = (event) => {
    setUploadedFiles([...event.target.files]);
  };

  const handleSkipLinesChange = (event) => {
    setSkipLines(parseInt(event.target.value, 10));
  };

  const handleMerge = async () => {
    if (uploadedFiles.length < 2) {
      toast.error("Please select at least two files to merge.");
      return;
    }

    setIsMerging(true);
    try {
      const response = await fetch("/merge", {
        method: "POST",
        body: new FormData(fileInputRef.current),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        setIsReady(true);
      } else {
        toast.error(result.error || "Error merging files.");
      }
    } catch (error) {
      toast.error("Error connecting to the server.");
    } finally {
      setIsMerging(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch("/download", {
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
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-lg w-full flex flex-col gap-8 rounded-xl py-10  bg-pink-50 my-10">
      <h2 className="text-xl font-bold font-sans uppercase bg-black text-white inline p-2 rounded-2xl text-center">
        File Merger
      </h2>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        ref={fileInputRef}
        className="border p-1 w-full"
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
        disabled={isMerging || uploadedFiles.length < 2}
      >
        {isMerging ? "Loading..." : "Merge Files"}
      </button>
      <button
        onClick={handleDownload}
        className={`border border-black font-bold px-3 py-1 text-white rounded-lg ${
          isReady ? "bg-green-400" : "bg-gray-400"
        }`}
        disabled={!isReady || isDownloading}
      >
        {isDownloading ? "Preparing Download..." : "Download Merged File"}
      </button>
    </div>
  );
}

export default LargeFileMerger;
