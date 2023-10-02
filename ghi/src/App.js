import './App.css';
import Papa from 'papaparse';
import { useState, useCallback } from 'react';
import { CSVLink } from 'react-csv';


// Sorts data according to the sortKey and sortOrder
function sortData(values, sortKey, sortOrder) {
  if (!sortKey && sortKey !== 0) {
    return values
  }

  const sortedData = values.sort((a,b) => {
    return a[sortKey] > b[sortKey] ? 1 : -1
  })

  if (sortOrder === 'desc') {
    return sortedData.reverse()
  }

  return sortedData;
}


function App() {
  // State hook for table column names
  const [tableColumns, setTableColumns] = useState([]);
  // State hook for table values
  const [values, setValues] = useState([]);
  // State hook for the sort key (i.e. sort column), defaulted to null (i.e. unsorted)
  const [sortKey, setSortKey] = useState()
  // State hook for the sort order, defaulted to ascending
  const [sortOrder, setSortOrder] = useState('asc')


  // Parses the uploaded CSV & sets table column and value state hooks
  const uploadHandler = (event) => {
    if (event.target.files[0]) {
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
    }
  };


  // Converts the data back into CSV for export
  const csv = Papa.unparse({
    "fields": tableColumns,
    "data": values,
  },{
    header: true,
    delimiter: ";",
  });


  // Calls the sortData function any time values, sortKey, or sortOrder change
  const sortedValues = useCallback(
    () => sortData(values, sortKey, sortOrder),
    [values, sortKey, sortOrder]
  )


  // Changes the sortKey and/or sortOrder when the ▲ or ▼ buttons are pressed
  function changeSort(key) {
    if (key === sortKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }


  return (
    <>
      <div className="title-section">
        <h1>CSV Viewer</h1>
        <h3>Select a file to view, sort, and download</h3>
        <label
          className="active-file-upload-download"
          htmlFor="file-upload">
          <u>↑</u> Choose File
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".csv"
          onChange={uploadHandler}
        />
        <CSVLink
          className={sortedValues()[0] ? "active-file-upload-download" : "innactive-button"}
          filename="data.csv"
          data={csv}>
          <u>↓</u> Download CSV
        </CSVLink>
      </div>
      <div className="data-table">
        <table cellspacing="0">
          <thead>
            <tr>
              {tableColumns.map((column, idx) => {
                return (
                  <th key={idx}>
                    {column}
                    <button
                      onClick={() => changeSort(idx)}>
                      {(idx === sortKey && sortOrder === 'desc') ? '▼' : '▲'}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
              {sortedValues().map((value, idx) => {
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
