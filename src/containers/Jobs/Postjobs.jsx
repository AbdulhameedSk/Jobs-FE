
import React, { useEffect, useState } from "react";
import CustomRewardInput from "../../components/CustomRewardInput/CustomRewardInput";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
} from "@mui/material";

export default function PostJobs({ postJob, job = null }) {
  const [formData, setFormData] = useState({
    role: "",
    OpenedFor:"",
    industry: "",
    vacancies: "",
    workDays: "",
    jobTiming: "",
    benefits: "",
    jobDescription: "",
    type: "",
    status: "",
    gender: "",
    experience: "",
    education: "",
    otherSkills: "",
    salary: "",
    companyName: "",
    companyAddress1: "",
    companyAddress2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    age: "",
  });

  const [value, setValue] = useState([20, 37]);
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [editID, setEditID] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSalaryChange = () => {
    setFormData({
      ...formData,
      salary: `${minSalary} - ${maxSalary} Years`,
    });
  };

  useEffect(() => {
    handleSalaryChange();
  }, [minSalary, maxSalary]);

  useEffect(() => {
    if (job) {
      setEditID(job._id);
      delete job._id;
      delete job.createdAt;
      delete job.updatedAt;
      delete job.__v;
      const salary = job.salary.split(" - ");
      setMinSalary(salary[0]);
      setMaxSalary(salary[1]);
      const age = job.age.split(" - ");
      setValue([parseInt(age[0]), parseInt(age[1])]);
      setFormData(job);
    }
  }, [job]);
  


  return (
    <div className="post-job">
      <h1 className="h2-style">Post Job</h1>
      <div className="container-job">
        <div className="text">
          <p>Job Details</p>
          <div className="input-container">
            <CustomRewardInput
              iconName={"FaUser"}
              placeholder={"Role*"}
              value={formData.role}
              name="role"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName={"PiFactoryFill"}
              placeholder={"Industry*"}
              value={formData.industry}
              name="industry"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName={"PiOfficeChairFill"}
              placeholder={"Vacancies"}
              value={formData.vacancies}
              name="vacancies"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName={"IoCalendarNumber"}
              placeholder={"Days of Work"}
              value={formData.workDays}
              name="workDays"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName={"IoMdTimer"}
              placeholder={"Job Timing"}
              value={formData.jobTiming}
              name="jobTiming"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName={"FaStar"}
              placeholder={"Benefits"}
              value={formData.benefits}
              name="benefits"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName={"FaFileAlt"}
              placeholder={"Job Description*"}
              value={formData.jobDescription}
              name="jobDescription"
              setValue={handleChange}
              event={true}
            />
            <FormControl fullWidth className="dropdown">
              <InputLabel id="demo-simple-select-label">Select Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData.type}
                label="Select Type"
                name="type"
                onChange={handleChange}
              >
                <MenuItem value={"Contractual"}>Contractual</MenuItem>
                <MenuItem value={"Permanent"}>Permanent</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth className="dropdown">
              <InputLabel id="demo-simple-select-label">Opened For</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData.OpenedFor}
                label="Select Type"
                name="type"
                onChange={handleChange}
              >
                <MenuItem value={"Contractual"}>Public</MenuItem>
                <MenuItem value={"Permanent"}>Internal Opening</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth className="dropdown">
              <InputLabel id="demo-simple-select-label">
                Select Status
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData.status}
                label="Select Status"
                name="status"
                onChange={handleChange}
              >
                <MenuItem value={"Active"}>Active</MenuItem>
                <MenuItem value={"Closed"}>Closed</MenuItem>
                <MenuItem value={"Unpublished"}>Unpublished</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth className="dropdown">
              <InputLabel id="demo-simple-select-label">
                Select Gender
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData.gender}
                label="Select Gender"
                name="gender"
                onChange={handleChange}
              >
                <MenuItem value={"Male"}>Male</MenuItem>
                <MenuItem value={"Female"}>Female</MenuItem>
                <MenuItem value={"Transgender"}>Transgender</MenuItem>
                <MenuItem value={"Any"}>Any</MenuItem>
              </Select>
            </FormControl>
            <CustomRewardInput
              iconName={"BsBarChartFill"}
              placeholder={"Experience Requirement"}
              value={formData.experience}
              name="experience"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName={"FaGraduationCap"}
              placeholder={"Education Requirement"}
              value={formData.education}
              name="education"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName={"IoExtensionPuzzle"}
              placeholder={"Other Skills Required"}
              value={formData.otherSkills}
              name="otherSkills"
              setValue={handleChange}
              event={true}
            />
          </div>
        </div>
      </div>
      <div className="container-job">
        <div className="text">
          <p>Salary Range (Per Month) *</p>
          <div className="input-container">
            <CustomRewardInput
              iconName={"FaIndianRupeeSign"}
              placeholder={"Minimum Salary"}
              value={minSalary}
              name="salary"
              setValue={(e) => {
                setMinSalary(e.target.value);
              }}
              event={true}
            />
            <CustomRewardInput
              iconName={"FaIndianRupeeSign"}
              placeholder={"Maximum Salary"}
              value={maxSalary}
              name="salary"
              setValue={(e) => {
                setMaxSalary(e.target.value);
              }}
              event={true}
            />
          </div>
        </div>
      </div>
      <div className="container-job">
        <div className="text">
          <p>Age Range {`(${value[0]} - ${value[1]})`}</p>
          <div className="input-container">
            <Slider
              className="slider"
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
                setFormData({
                  ...formData,
                  age: `${newValue[0]} - ${newValue[1]}`,
                });
              }}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              max={70}
              min={18}
              disableSwap
            />
          </div>
        </div>
      </div>
      <div className="container-job">
        <div className="text">
          <p>Company Details</p>
          <div className="input-container">
            <CustomRewardInput
              iconName={"FaBuilding"}
              placeholder={"Company Name*"}
              value={formData.companyName}
              name="companyName"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName={"FaLocationDot"}
              placeholder={"Address Line 1*"}
              value={formData.companyAddress1}
              name="companyAddress1"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName={"FaLocationDot"}
              placeholder={"Address Line 2"}
              value={formData.companyAddress2}
              name="companyAddress2"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName={"FaTreeCity"}
              placeholder={"City*"}
              value={formData.city}
              name="city"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName={"FaMountainCity"}
              placeholder={"State*"}
              value={formData.state}
              name="state"
              setValue={handleChange}
              event={true}
            />

            <CustomRewardInput
              iconName={"FaGlobeAmericas"}
              placeholder={"Country*"}
              value={formData.country}
              name="country"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName={"FaLocationDot"}
              placeholder={"Pincode*"}
              value={formData.pincode}
              name="pincode"
              setValue={handleChange}
              event={true}
            />
          </div>
        </div>
      </div>
      {job ? (
        <button
          className="add-button"
          onClick={() => {
            postJob(formData, "update", editID);
          }}
        >
          Update Job
        </button>
      ) : (
        <button
          className="add-button bg-blue-600 text-white hover:bg-blue-700 h-10 w-32 rounded-md" 
          onClick={() => {
            postJob(formData);
          }}
        >
          Post Job
        </button>
      )}
    </div>
  );
}
