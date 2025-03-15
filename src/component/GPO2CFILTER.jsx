import React, { useState } from "react";
import XLSX from "xlsx";

const GPO2CFILTER = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [file, setFile] = useState(null);

  const targetMSISDNs = [
    "1708257676",
    "1321263110",
    "1315757457",
    "1321256750",
    "1324756661",
    "1324759095",
    "1324747888",
    "1324747887",
    "1321251611",
    "1321238004",
    "1321264823",
    "1324750864",
    "1321264444",
    "1324750578",
    "1321247675",
    "1324774211",
    "1324774945",
    "1324759938",
    "1321272204",
    "1708287012",
    "1708298330",
    "1324774966",
    "1708298328",
  ];

  const processFile = () => {
    if (!file) {
      alert("Please upload an Excel file.");
      return;
    }

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      if (!jsonData[0]["Reseller MSISDN"]) {
        alert("Column 'Reseller MSISDN' not found.");
        return;
      }

      const filteredData = jsonData.filter((row) =>
        targetMSISDNs.includes(String(row["Reseller MSISDN"]))
      );
      setFilteredData(filteredData);
    };
  };

  const displayData = (data) => {
    if (data.length === 0) {
      return <p style={{ color: "red" }}>No matching records found.</p>;
    }

    if (!Object.keys(data[0]).length) {
      return <p style={{ color: "red" }}>No data available.</p>;
    }

    let table = (
      <table>
        <tr>
          {Object?.keys(data[0]).map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
        {data.map((row) => (
          <tr key={row["Reseller MSISDN"]}>
            {Object?.values(row).map((value) => (
              <td key={value}>{value}</td>
            ))}
          </tr>
        ))}
      </table>
    );
    return table;
  };
  const downloadFilteredData = () => {
    if (filteredData.length === 0) return;

    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Filtered Data");
    XLSX.writeFile(wb, "Filtered_Reseller_MSISDN.xlsx");
  };

  return (
    <div className="container">
      <h2>Upload Excel File</h2>
      <input
        type="file"
        id="fileInput"
        accept=".xlsx"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={processFile}>Filter Data</button>
      <button
        id="downloadBtn"
        style={{ display: filteredData.length > 0 ? "inline-block" : "none" }}
        onClick={downloadFilteredData}
      >
        Download Filtered Data
      </button>
      <div id="output">{displayData(filteredData)}</div>
    </div>
  );
};

export default GPO2CFILTER;
