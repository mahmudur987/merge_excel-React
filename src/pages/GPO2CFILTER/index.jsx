import { useState } from "react";
import * as XLSX from "xlsx";

export default function ExcelFilter() {
  const [filteredData, setFilteredData] = useState([]);

  const targetMSISDNs = new Set([
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
    "1321271800",
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
  ]);
  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (!files.length) return;

    let allFilteredData = [];

    const processFile = (file, index) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        if (!jsonData[0] || !jsonData[0]["Reseller MSISDN"]) {
          alert(`Column 'Reseller MSISDN' not found in file: ${file.name}`);
          return;
        }

        const filtered = jsonData.filter((row) =>
          targetMSISDNs.has(String(row["Reseller MSISDN"]))
        );
        allFilteredData = [...allFilteredData, ...filtered];

        if (index === files.length - 1) {
          setFilteredData(allFilteredData);
        }
      };
    };

    Array.from(files).forEach((file, index) => processFile(file, index));
  };

  const handleDownload = () => {
    if (filteredData.length === 0) return;

    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Filtered Data");
    XLSX.writeFile(wb, "Filtered_Reseller_MSISDN.xlsx");
    setFilteredData([]);
  };

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-bold mb-4">Excel Reseller MSISDN Filter</h2>
      <input
        type="file"
        accept=".xls,.xlsx,.csv"
        multiple
        onChange={handleFileUpload}
        className="mb-4"
      />
      {filteredData.length > 0 && (
        <button
          onClick={handleDownload}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Download Filtered Data
        </button>
      )}
      <div className="mt-4">
        <h2 className="text-lg font-bold">
          Total data {filteredData.length ? filteredData.length : 0}
        </h2>
        {filteredData.length > 0 ? (
          <table className="border-collapse border w-full mt-4">
            <thead>
              <tr>
                {Object.keys(filteredData[0]).map((key) => (
                  <th key={key} className="border p-2">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i} className="border p-2">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No matching records found.</p>
        )}
      </div>
    </div>
  );
}
