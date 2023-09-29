import './App.css';
import Papa from 'papaparse';
import { useState } from 'react';
import { CSVLink } from 'react-csv';

function App() {
  // State hook for table column names
  const [tableColumns, setTableColumns] = useState([]);
  // State hook for table values
  const [values, setValues] = useState([]);

  // Handler to parse the uploaded CSV & set table column and value state hooks
  const uploadHandler = (event) => {
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const columnsArray = [];
        const valuesArray = [];

        results.data.forEach((d) => {
          columnsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
      });

        setTableColumns(columnsArray[0]);

        setValues(valuesArray);
      },
    });
  };

  // Converting the data back into CSV for export
  const csv = Papa.unparse({
    "fields": tableColumns,
    "data": values,
  },{
    header: true,
  });

  return (
    <>
      <div className="file-upload">
        <h1>CSV Viewer & Editor</h1>
        <h3>{tableColumns[0] ? "Select a new file to upload": "Select a file to upload"}</h3>
        <input
          type="file"
          name="file"
          accept=".csv"
          onChange={uploadHandler}
        />
        <CSVLink filename="data.csv" data={csv}>Download CSV</CSVLink>
      </div>
      <div className="data-table">
        <table>
          <thead>
            <tr>
              {tableColumns.map((column, idx) => {
                return <th key={idx}>{column}</th>
              })}
            </tr>
          </thead>
          <tbody>
              {values.map((value, idx) => {
                return (
                  <tr key={idx}>
                    {value.map((val, idx2) => {
                      return <td key={idx2}>{val}</td>
                    })}
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
