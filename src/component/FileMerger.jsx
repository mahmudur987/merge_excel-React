import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
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

        if (extension === "csv") {
          Papa.parse(data, {
            header: false, // Do not treat the first row as headers
            skipEmptyLines: true,
            complete: (results) => {
              // Skip specified lines; include every row
              const dataWithHeaders =
                skipLines > 0 ? results.data.slice(skipLines) : results.data;
              resolve(dataWithHeaders);
            },
          });
        } else if (extension === "xls" || extension === "xlsx") {
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheetData = XLSX.utils.sheet_to_json(
            workbook.Sheets[sheetName],
            { header: 1 }
          );

          // Skip specified lines; include every row
          const dataWithHeaders =
            skipLines > 0 ? sheetData.slice(skipLines) : sheetData;

          resolve(dataWithHeaders);
        } else {
          reject(new Error("Unsupported file format"));
        }
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

    for (const file of files) {
      // Read each file's data and keep headers intact
      const data = await readFile(file, skipLines);

      // Append each file's data (with headers) to allData
      allData = allData.concat(data);
    }

    setMergedData(allData);

    toast.success(
      "File merge successful! Your merged file is ready for download."
    );

    setMergedData(allData);
    setFiles([]); // Clear the files in state

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Step 2: Clear the input field using the ref
    }
    setLoading(false);
  };

  const handleDownload = () => {
    if (!active) return toast.error("select files");
    setLoading1(true);
    const newWorkbook = XLSX.utils.book_new();
    const newWorksheet = XLSX.utils.json_to_sheet(mergedData);
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "MergedData");

    // Generate a random number or timestamp for unique filenames
    const randomNum = Math.floor(Math.random() * 10000); // Random 4-digit number
    const timestamp = Date.now(); // Alternatively, use timestamp for uniqueness
    const fileName = `MergedData_${timestamp}_${randomNum}.xlsx`;

    XLSX.writeFile(newWorkbook, fileName);
    setLoading1(false);
  };

  return (
    <div className="max-w-lg w-full flex flex-col border border-black p-5 mx-auto gap-8 ">
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
