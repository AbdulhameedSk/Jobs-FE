import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import "./CustomTable.css";
import CustomIcon from "../CustomIcon";

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

const CustomTableV2 = forwardRef(
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
      clearFilters,
      clickFunctioArray,
      clickSortFunctionArray,
    },
    ref
  ) => {
    const [columnFilters, setColumnFilters] = useState({});

    if (!columnsizes || columnsizes.length !== headers.length) {
      columnsizes = headers.map(() => "auto");
    }

    const handleHeaderClick = (index) => {
      if (clickSortFunctionArray[index]) {
        clickSortFunctionArray[index][0]();
      }
    };

    const downloadCsvData = () => {};

    useImperativeHandle(ref, () => ({
      downloadCsvData,
      clearAllFilters,
    }));

    const handleOpenModal = (e, index) => {
      e.stopPropagation();
      clickFunctioArray[index]();
    };

    const clearAllFilters = () => {
      clearFilters();
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
                              {clickSortFunctionArray[index] &&
                              clickSortFunctionArray[index][1] === "asc" ? (
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
                                onClick={(e) => handleOpenModal(e, index)}
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
            {rows.map((row, rowIndex) => (
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
      </div>
    );
  }
);

export default CustomTableV2;
