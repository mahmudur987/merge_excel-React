import { useState } from "react";
import * as XLSX from "xlsx";

const HeaderLess = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mismatchedFiles, setMismatchedFiles] = useState([]);
  const [mergedData, setMergedData] = useState(null);

  const handleFileChange = (event) => {
    // Reset all states to ensure a fresh start
    setFiles([]);
    setError("");
    setLoading(false);
    setMismatchedFiles([]);
    setMergedData(null);

    // Process selected files
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length <= 1) {
      setError("Please select more than one file to merge.");
      return;
    }

    setFiles(selectedFiles);
  };

  const handleMerge = async () => {
    setLoading(true);
    setError("");
    setMismatchedFiles([]);
    let mergedSheet = [];
    let referenceColumns = null;
    let unstructuredData = [];

    for (const file of files) {
      try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (sheetData.length === 0) {
          // Skip empty sheets
          setMismatchedFiles((prev) => [...prev, file.name]);
          continue;
        }

        if (!referenceColumns) {
          // Set reference columns using the first non-empty file
          referenceColumns = Object.keys(sheetData[0]);
          mergedSheet = [...sheetData];
        } else if (
          JSON.stringify(referenceColumns) ===
          JSON.stringify(Object.keys(sheetData[0]))
        ) {
          mergedSheet = [...mergedSheet, ...sheetData];
        } else {
          // Normalize unstructured file data
          const normalizedData = sheetData.map((row) => {
            const normalizedRow = {};
            referenceColumns.forEach((col) => {
              normalizedRow[col] = row[col] || null; // Fill missing columns with null
            });
            return normalizedRow;
          });
          unstructuredData = [...unstructuredData, ...normalizedData];
          setMismatchedFiles((prev) => [...prev, file.name]);
        }
      } catch (error) {
        setMismatchedFiles((prev) => [...prev, file.name]);
        console.log(error);
      }
    }

    // Merge valid and unstructured data
    const finalData = [...mergedSheet, ...unstructuredData];
    setMergedData(finalData);
    setLoading(false);
  };

  const handleDownload = () => {
    if (!mergedData || mergedData.length === 0) {
      setError("No data available to download.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(mergedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Merged Data");

    const fileName = `merged_data_${Date.now()}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    setFiles(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Excel Merger</h1>

      <input
        type="file"
        multiple
        accept=".xls,.xlsx,.csv"
        onChange={handleFileChange}
        className="mb-4 border p-2 w-full"
      />

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {mismatchedFiles.length > 0 && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          <h3 className="font-semibold">Mismatched Files:</h3>
          <ul>
            {mismatchedFiles.map((fileName, index) => (
              <li key={index}>{fileName}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleMerge}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Merging..." : "Merge"}
        </button>
        <button
          onClick={handleDownload}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={loading || !mergedData}
        >
          {!mergedData ? "No data to download" : "Download"}
        </button>
      </div>
    </div>
  );
};

export default HeaderLess;
