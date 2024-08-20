import React from "react";
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getDisplayedPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      // If total pages are less than or equal to 7, display all page numbers
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Display logic for more than 7 pages
      if (currentPage <= 4) {
        // If current page is less than or equal to 4, display first 6 pages and last page
        for (let i = 1; i <= 6; i++) {
          pages.push(i);
        }
        pages.push("...", totalPages);
      } else if (currentPage > totalPages - 4) {
        // If current page is within the last 4 pages, display first page, ellipsis, and last 6 pages
        pages.push(1, "...");
        for (let i = totalPages - 5; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // If current page is somewhere in the middle, display first page, ellipsis, 3 pages around the current page, ellipsis, and last page
        pages.push(1, "...");
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
        pages.push("...", totalPages);
      }
    }

    return pages;
  };

  const displayedPageNumbers = getDisplayedPageNumbers();

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      {displayedPageNumbers.map((num, index) => (
        <button
          key={index}
          onClick={() => num !== "..." && onPageChange(num)}
          className={currentPage === num ? "active" : ""}
          disabled={num === "..."}
        >
          {num}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
