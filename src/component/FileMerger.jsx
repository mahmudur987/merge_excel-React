import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

function FileMerger() {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [skipLines, setSkipLines] = useState(0);
  const [mergedData, setMergedData] = useState(null);
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
  const readFile = (file, skipLines) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const extension = file.name.split(".").pop().toLowerCase();

      reader.onload = (e) => {
        const data = e.target.result;
        let parsedData;

        if (extension === "csv") {
          parsedData = XLSX.read(data, { type: "binary", cellDates: true });
        } else if (extension === "xls" || extension === "xlsx") {
          parsedData = XLSX.read(data, { type: "binary", cellDates: true });
        } else {
          reject(new Error("Unsupported file format"));
          return;
        }

        const sheetName = parsedData.SheetNames[0];
        const sheet = parsedData.Sheets[sheetName];

        // Use `header: 1` to include all rows as arrays and skip specified lines
        const sheetData = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          raw: true,
        });
        const dataWithHeaders =
          skipLines > 0 ? sheetData.slice(skipLines) : sheetData;
        resolve(dataWithHeaders);
      };

      if (extension === "csv") {
        reader.readAsText(file);
      } else {
        reader.readAsBinaryString(file);
      }
    });
  };
  const handleMerge = async () => {
    if (files.length === 0) return toast.error("please select files");
    setActive(true);

    setLoading(true);

    let allData = [];
    let isFirstFile = true;

    for (const file of files) {
      const data = await readFile(file, skipLines);

      // If we're not on the first file, add data without an extra empty row
      if (!isFirstFile && data.length > 0) {
        allData = allData.concat(data);
      } else {
        allData = data;
        isFirstFile = false; // After the first file, set flag to false
      }
    }

    setMergedData(allData);

    toast.success(
      "File merge successful! Your merged file is ready for download."
    );

    setMergedData(allData);
    setFiles([]); // Clear the files in state
    setSkipLines(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Step 2: Clear the input field using the ref
    }
    setLoading(false);
  };

  const handleDownload = () => {
    if (!active) return toast.error("select files");

    setLoading1(true);
    const newWorkbook = XLSX.utils.book_new();
    const newWorksheet = XLSX.utils.aoa_to_sheet(mergedData); // Preserves format
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "MergedData");

    // Generate a filename with a random number for uniqueness
    const randomNum = Math.floor(Math.random() * 10000);
    XLSX.writeFile(newWorkbook, `MergedData_${randomNum}.xlsx`);
    toast.success("Your download will begin shortly.");
    setLoading1(false);
  };

  return (
    <div className="max-w-lg w-full flex flex-col border border-blue-700 p-5 mx-auto gap-8 rounded-xl py-10 ">
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
        className="border border-black font-bold  px-3 py-1 bg-red-400 text-white rounded-lg"
      >
        {loading ? "loading  ..." : "Merge Files"}
      </button>
      <button
        onClick={handleDownload}
        className={`border border-black font-bold  px-3 py-1 text-white rounded-lg    ${
          active ? " bg-green-400" : "bg-gray-400"
        }`}
      >
        {loading1 ? "loading ..." : "Download Merged File"}
      </button>
    </div>
  );
}

export default FileMerger;
