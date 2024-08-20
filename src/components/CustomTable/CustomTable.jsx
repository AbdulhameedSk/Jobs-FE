import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import "./CustomTable.css";
import CustomIcon from "../CustomIcon";
import CustomFilterModal from "../CustomFilterModal/CustomFilterModal";
import dayjs from "dayjs";

function CellContent({ content }) {
  const [showMore, setShowMore] = useState(false);
  const truncatedContent = showMore ? content : content.slice(0, 50);
  return (
    <div>
      {truncatedContent + "..."}
      {content.length > 50 && (
        <span onClick={() => setShowMore(!showMore)}>
          {showMore ? (
            <span className="show-options">Show Less</span>
          ) : (
            <span className="show-options">Show More</span>
          )}
        </span>
      )}
    </div>
  );
}

const CustomTable = forwardRef(
  (
    {
      headers,
      rows,
      columnsizes,
      filterTypes,
      textAlign,
      searchInput,
      setFiltersApplied,
      sticky,
    },
    ref
  ) => {
    const [sortedRows, setSortedRows] = useState(rows);
    const [filteredRows, setFilteredRows] = useState(rows);
    const [sortOrder, setSortOrder] = useState({});
    const [filterModal, setFilterModal] = useState(false);
    const [filterInput, setFilterInput] = useState("");
    const [filterText, setFilterText] = useState("");
    const [columnFilters, setColumnFilters] = useState({});
    const [filterRange, setFilterRange] = useState([0, 100]);
    const [columnRangeFilters, setColumnRangeFilters] = useState({});
    const [filterType, setFilterType] = useState();
    const [maxFilterRange, setMaxFilterRange] = useState(100);
    const [filterDate, setFilterDate] = useState([null, null]);
    const [columnDateFilters, setColumnDateFilters] = useState({});

    if (!columnsizes || columnsizes.length !== headers.length) {
      columnsizes = headers.map(() => "auto");
    }

    const handleHeaderClick = (index) => {
      const key = headers[index];
      const order = sortOrder[key] === "asc" ? "desc" : "asc";

      const sorted = [...filteredRows].sort((a, b) => {
        const valueA = a[index];
        const valueB = b[index];

        if (valueA < valueB) {
          return order === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return order === "asc" ? 1 : -1;
        }
        return 0;
      });

      setSortedRows(sorted);
      setFilteredRows(sorted);
      setSortOrder({ ...sortOrder, [key]: order });
    };

    const downloadCsvData = () => {
      const csvContent =
        "data:text/csv;charset=utf-8," +
        headers.join(",") +
        "\n" +
        filteredRows.map((row) => row.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "table_data.csv");
      document.body.appendChild(link);
      link.click();
    };

    useImperativeHandle(ref, () => ({
      downloadCsvData,
      clearAllFilters,
    }));

    const handleOpenModal = (e, header, type) => {
      e.stopPropagation();
      setFilterText(header);
      setFilterType(type);
      setFilterInput(columnFilters[header] || "");
      if (type === "range") {
        const columnIndex = headers.indexOf(header);
        const columnValues = rows
          .map((row) => parseFloat(row[columnIndex]))
          .filter((value) => !isNaN(value));
        const maxValue = Math.max(...columnValues);
        if (columnRangeFilters[header] === undefined) {
          setFilterRange([0, maxValue]);
        } else {
          setFilterRange(columnRangeFilters[header]);
        }
        setMaxFilterRange(maxValue);
      }

      setFilterModal(true);
    };

    useEffect(() => {
      filterRows();
    }, [searchInput, columnFilters, columnRangeFilters, columnDateFilters]);

    useEffect(() => {
      setSortedRows(rows);
      setFilteredRows(rows);
    }, [rows]);

    const filterRows = () => {
      let filtered = [...sortedRows];

      if (searchInput) {
        filtered = filtered.filter((row) =>
          row.some((cell) =>
            cell?.toString().toLowerCase().includes(searchInput.toLowerCase())
          )
        );
      }

      Object.keys(columnFilters).forEach((header) => {
        const filterValue = columnFilters[header].toLowerCase();
        const columnIndex = headers.indexOf(header);

        filtered = filtered.filter((row) => {
          const cellValue = row[columnIndex].toString().toLowerCase();
          if (header === "Gender") {
            return cellValue === filterValue;
          } else {
            return cellValue.includes(filterValue);
          }
        });
      });

      Object.keys(columnRangeFilters).forEach((header) => {
        const [min, max] = columnRangeFilters[header];
        const columnIndex = headers.indexOf(header);

        filtered = filtered.filter((row) => {
          const cellValue = parseFloat(row[columnIndex]);
          return cellValue >= min && cellValue <= max;
        });
      });

      Object.keys(columnDateFilters).forEach((header) => {
        const [from, to] = columnDateFilters[header];
        const columnIndex = headers.indexOf(header);

        filtered = filtered.filter((row) => {
          const cellValue = dayjs(row[columnIndex]);
          return cellValue.isAfter(from) && cellValue.isBefore(to);
        });
      });

      setFilteredRows(filtered);
    };

    const handleFilter = () => {
      const updatedFilters = { ...columnFilters };
      updatedFilters[filterText] = filterInput;
      setColumnFilters(updatedFilters);
      setFiltersApplied(true);
      setFilterModal(false);
    };

    const handleRangeFilter = () => {
      const updatedRangeFilters = { ...columnRangeFilters };
      updatedRangeFilters[filterText] = filterRange;
      setColumnRangeFilters(updatedRangeFilters);
      setFiltersApplied(true);
      setFilterModal(false);
    };

    const handleDateFilter = () => {
      const updatedDateFilters = { ...columnDateFilters };
      updatedDateFilters[filterText] = filterDate;
      setColumnDateFilters(updatedDateFilters);
      setFiltersApplied(true);
      setFilterModal(false);
    };

    const clearAllFilters = () => {
      setColumnFilters({});
      setColumnRangeFilters({});
      setColumnDateFilters({});
      setFiltersApplied(false);
    };

    return (
      <div className="relative">
        <table className="c-table">
          <thead>
            <tr>
              {headers &&
                headers.map((header, index) => (
                  <th
                    key={index}
                    onClick={() => handleHeaderClick(index)}
                    className={`c-table__header__cell ${
                      sticky?.includes(index) ? "sticky" : ""
                    }`}
                    style={{ width: columnsizes[index] }}
                  >
                    <div className="header">
                      <div>{header}</div>
                      {filterTypes[index] !== "none" &&
                        header !== "Actions" && (
                          <div className="icons">
                            <span className="sort-icon">
                              {sortOrder[header] === "asc" ? (
                                <CustomIcon name="IoIosArrowUp" />
                              ) : (
                                <CustomIcon name="IoIosArrowDown" />
                              )}
                            </span>
                            <span
                              className={columnFilters[header] && "visible"}
                            >
                              <CustomIcon
                                name="RiFilter2Line"
                                onClick={(e) =>
                                  handleOpenModal(e, header, filterTypes[index])
                                }
                              />
                            </span>
                          </div>
                        )}
                    </div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, rowIndex) => (
              <tr key={rowIndex} className="c-table__body__row">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`c-table__body__cell ${
                      sticky?.includes(cellIndex) ? "sticky" : ""
                    } ${cell === "Active" && "active"}
                      ${cell === "Published" && "active"}
                      ${cell === "Unpublished" && "suspended"}
                      ${cell === "Suspended" && "suspended"}
                      ${cell === "Rejected" && "suspended"}
                      ${cell === "In Approval" && "yellow"}
                      ${cell === "DisApproval" && "yellow"}
                      ${cell === "Approved" && "blue"}
                      ${textAlign && textAlign[cellIndex]}
                     `}
                  >
                    {typeof cell === "string" && cell.length > 50 ? (
                      <CellContent content={cell} />
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {filterModal && filterType === "text" && (
          <CustomFilterModal
            onClose={() => setFilterModal(false)}
            filterText={filterText}
            filterInput={filterInput}
            setFilterInput={setFilterInput}
            handleFilter={handleFilter}
            type={filterType}
          />
        )}
        {filterModal && filterType === "range" && (
          <CustomFilterModal
            onClose={() => setFilterModal(false)}
            filterText={filterText}
            filterInput={filterInput}
            setFilterInput={setFilterInput}
            type={filterType}
            filterRange={filterRange}
            setFilterRange={setFilterRange}
            handleFilter={handleRangeFilter}
            maxFilterRange={maxFilterRange}
          />
        )}
        {filterModal && filterType === "date" && (
          <CustomFilterModal
            onClose={() => setFilterModal(false)}
            filterText={filterText}
            filterInput={filterInput}
            setFilterInput={setFilterInput}
            type={filterType}
            filterDate={filterDate}
            setFilterDate={setFilterDate}
            handleFilter={handleDateFilter}
          />
        )}
      </div>
    );
  }
);

export default CustomTable;
