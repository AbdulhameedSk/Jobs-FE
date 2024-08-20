import React, { useState } from "react";
import "./CustomFilterModal.css";
import { CiFilter } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { FormControl, InputLabel, Slider } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const CustomFilterModal = ({
  onClose,
  filterText,
  filterInput,
  setFilterInput,
  handleFilter,
  type,
  filterRange,
  setFilterRange,
  maxFilterRange,
  filterDate,
  setFilterDate,
}) => {
  const handleRangeChange = (event, newValue) => {
    setFilterRange(newValue);
  };

  const renderFilterInput = () => {
    switch (type) {
      case "text":
        return (
          <div className="mb-3">
            <div className="input-group flex-nowrap">
              <span
                className="input-group-text input-icons-style"
                id="addon-wrapping"
              >
                <CiFilter />
              </span>
              <input
                type="text"
                value={filterInput}
                onChange={(e) => setFilterInput(e.target.value)}
                className="form-control input-text-style"
                placeholder={`Search ${filterText}`}
                aria-label="Filter input"
                aria-describedby="addon-wrapping"
              />
            </div>
          </div>
        );
      case "date":
        return (
          <div className="mb-3">
            <FormControl fullWidth className="date-picker">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="From"
                  value={filterDate[0]}
                  onChange={(newValue) =>
                    setFilterDate([newValue, filterDate[1]])
                  }
                />
              </LocalizationProvider>
            </FormControl>
            <FormControl fullWidth className="date-picker">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="To"
                  value={filterDate[1]}
                  onChange={(newValue) =>
                    setFilterDate([filterDate[0], newValue])
                  }
                />
              </LocalizationProvider>
            </FormControl>
          </div>
        );
      case "range":
        return (
          <div className="mb-3">
            <FormControl fullWidth className="slider">
              <InputLabel id="range-filter-label">
                Range ({filterRange.join(" - ")})
              </InputLabel>
              <Slider
                value={filterRange}
                onChange={handleRangeChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={0}
                max={maxFilterRange}
                disableSwap
              />
            </FormControl>
          </div>
        );
      default:
        return (
          <div className="mb-3">
            <div className="input-group flex-nowrap">
              <span
                className="input-group-text input-icons-style"
                id="addon-wrapping"
              >
                <CiFilter />
              </span>
              <input
                type="text"
                value={filterInput}
                onChange={(e) => setFilterInput(e.target.value)}
                className="form-control input-text-style"
                placeholder={`Search ${filterText}`}
                aria-label="Filter input"
                aria-describedby="addon-wrapping"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <div className="modal-overlays">
        <div className="modal-contents box-shadow">
          <div className="filter-modal-title mb-4">
            <div>Filter by {filterText}</div>
            <div className="filter-modal-cross" onClick={onClose}>
              <RxCross2 />
            </div>
          </div>
          {renderFilterInput()}
          <div>
            <button
              type="button"
              className="button green"
              onClick={() => handleFilter(filterInput)}
            >
              Filter
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomFilterModal;
