import React, { useState } from "react";
import * as XLSX from "xlsx";

const DuplicateContentChecker = () => {
  const [files, setFiles] = useState([]);
  const [duplicateGroups, setDuplicateGroups] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to compare file contents
  const areSheetsEqual = (sheet1, sheet2) => {
    return JSON.stringify(sheet1) === JSON.stringify(sheet2);
  };

  const handleFileChange = async (event) => {
    setFiles([]);
    setDuplicateGroups([]);
    setError("");
    setLoading(true);

    const selectedFiles = Array.from(event.target.files);

    if (selectedFiles.length <= 1) {
      setError("Please select more than one file to check for duplicates.");
      setLoading(false);
      return;
    }

    const fileData = [];
    const duplicates = [];

    // Process each file
    for (const file of selectedFiles) {
      try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        fileData.push({
          fileName: file.name,
          sheetData,
        });
      } catch (err) {
        setError(`Failed to read file: ${file.name}`);
        setLoading(false);
        return;
      }
    }

    // Compare contents for duplicates
    const visited = new Set();
    for (let i = 0; i < fileData.length; i++) {
      if (visited.has(i)) continue;

      const duplicatesForFile = [fileData[i].fileName];
      for (let j = i + 1; j < fileData.length; j++) {
        if (visited.has(j)) continue;

        if (areSheetsEqual(fileData[i].sheetData, fileData[j].sheetData)) {
          duplicatesForFile.push(fileData[j].fileName);
          visited.add(j);
        }
      }

      if (duplicatesForFile.length > 1) {
        duplicates.push(duplicatesForFile);
      }

      visited.add(i);
    }

    setDuplicateGroups(duplicates);
    setFiles(selectedFiles);
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Duplicate Content Checker</h2>
      <div className="mb-4">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="border border-gray-300 p-2 rounded"
          accept=".xls,.xlsx,.csv"
        />
      </div>

      {loading && (
        <p className="text-blue-700">Checking files for duplicates...</p>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      )}

      {files.length > 0 && (
        <div className="bg-blue-100 text-blue-700 p-4 rounded mb-4">
          <h3 className="font-semibold">Uploaded Files:</h3>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

      {duplicateGroups.length > 0 ? (
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded mb-4">
          <h3 className="font-semibold">Duplicate Files (Content):</h3>
          <ul>
            {duplicateGroups.map((group, index) => (
              <li key={index}>{group.join(", ")}</li>
            ))}
          </ul>
        </div>
      ) : (
        files.length > 0 &&
        !loading && (
          <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
            <p>No duplicate content found!</p>
          </div>
        )
      )}
    </div>
  );
};

export default DuplicateContentChecker;
