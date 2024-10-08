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
    openedFor: "For Public",
    status: "pending",
    industry: "",
    vacancies: "",
    workDays: "",
    jobTiming: "",
    benefits: "",
    jobDescription: "",
    type: "",
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

  const [ageRange, setAgeRange] = useState([20, 37]);
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [editID, setEditID] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSalaryChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      salary: `${minSalary} - ${maxSalary}`,
    }));
  };

  useEffect(() => {
    handleSalaryChange();
  }, [minSalary, maxSalary]);

  useEffect(() => {
    if (job) {
      setEditID(job._id);
      const { _id, createdAt, updatedAt, __v, ...jobData } = job;
      const salary = job.salary.split(" - ");
      setMinSalary(salary[0]);
      setMaxSalary(salary[1]);
      const age = job.age.split(" - ");
      setAgeRange([parseInt(age[0]), parseInt(age[1])]);
      setFormData(jobData);
    }
  }, [job]);

  const handleSubmit = () => {
    const updatedFormData = {
      ...formData,
      age: `${ageRange[0]} - ${ageRange[1]}`,
    };
    if (job) {
      postJob(updatedFormData, editID);
    } else {
      postJob(updatedFormData);
    }
  };

  return (
    <div className="post-job">
      <h1 className="h2-style">{job ? "Edit Job" : "Post a Job"}</h1>
      <div className="container-job">
        <div className="text">
          <p>Job Details</p>
          <div className="input-container">
            <CustomRewardInput
              iconName="FaUser"
              placeholder="Role*"
              value={formData.role}
              name="role"
              setValue={handleChange}
              event={true}
            />
            <FormControl fullWidth className="dropdown">
              <InputLabel id="openedFor-label">Opened For</InputLabel>
              <Select
                labelId="openedFor-label"
                value={formData.openedFor}
                label="Opened For"
                name="openedFor"
                onChange={handleChange}
              >
                <MenuItem value="For Public">For Public</MenuItem>
                <MenuItem value="For Employees">For Employees</MenuItem>
              </Select>
            </FormControl>
            <CustomRewardInput
              iconName="PiFactoryFill"
              placeholder="Industry*"
              value={formData.industry}
              name="industry"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName="PiOfficeChairFill"
              placeholder="Vacancies"
              value={formData.vacancies}
              name="vacancies"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName="IoCalendarNumber"
              placeholder="Days of Work"
              value={formData.workDays}
              name="workDays"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName="IoMdTimer"
              placeholder="Job Timing"
              value={formData.jobTiming}
              name="jobTiming"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName="FaStar"
              placeholder="Benefits"
              value={formData.benefits}
              name="benefits"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName="FaFileAlt"
              placeholder="Job Description*"
              value={formData.jobDescription}
              name="jobDescription"
              setValue={handleChange}
              event={true}
            />
            <FormControl fullWidth className="dropdown">
              <InputLabel id="type-label">Select Type</InputLabel>
              <Select
                labelId="type-label"
                value={formData.type}
                label="Select Type"
                name="type"
                onChange={handleChange}
              >
                <MenuItem value="Contractual">Contractual</MenuItem>
                <MenuItem value="Permanent">Permanent</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth className="dropdown">
              <InputLabel id="status-label">Select Status</InputLabel>
              <Select
                labelId="status-label"
                value={formData.status}
                label="Select Status"
                name="status"
                onChange={handleChange}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
                <MenuItem value="Unpublished">Unpublished</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth className="dropdown">
              <InputLabel id="gender-label">Select Gender</InputLabel>
              <Select
                labelId="gender-label"
                value={formData.gender}
                label="Select Gender"
                name="gender"
                onChange={handleChange}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Transgender">Transgender</MenuItem>
                <MenuItem value="Any">Any</MenuItem>
              </Select>
            </FormControl>
            <CustomRewardInput
              iconName="BsBarChartFill"
              placeholder="Experience Requirement"
              value={formData.experience}
              name="experience"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName="FaGraduationCap"
              placeholder="Education Requirement"
              value={formData.education}
              name="education"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName="IoExtensionPuzzle"
              placeholder="Other Skills Required"
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
              iconName="FaIndianRupeeSign"
              placeholder="Minimum Salary"
              value={minSalary}
              name="minSalary"
              setValue={(e) => setMinSalary(e.target.value)}
              event={true}
            />
            <CustomRewardInput
              iconName="FaIndianRupeeSign"
              placeholder="Maximum Salary"
              value={maxSalary}
              name="maxSalary"
              setValue={(e) => setMaxSalary(e.target.value)}
              event={true}
            />
          </div>
        </div>
      </div>
      <div className="container-job">
        <div className="text">
          <p>Age Range {`(${ageRange[0]} - ${ageRange[1]})`}</p>
          <div className="input-container">
            <Slider
              className="slider"
              value={ageRange}
              onChange={(event, newValue) => setAgeRange(newValue)}
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
              iconName="FaBuilding"
              placeholder="Company Name*"
              value={formData.companyName}
              name="companyName"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName="FaLocationDot"
              placeholder="Address Line 1*"
              value={formData.companyAddress1}
              name="companyAddress1"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName="FaLocationDot"
              placeholder="Address Line 2"
              value={formData.companyAddress2}
              name="companyAddress2"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName="FaTreeCity"
              placeholder="City*"
              value={formData.city}
              name="city"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName="FaMountainCity"
              placeholder="State*"
              value={formData.state}
              name="state"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName="FaGlobeAmericas"
              placeholder="Country*"
              value={formData.country}
              name="country"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName="FaLocationDot"
              placeholder="Pincode*"
              value={formData.pincode}
              name="pincode"
              setValue={handleChange}
              event={true}
            />
          </div>
        </div>
      </div>
      <button className="add-button" onClick={handleSubmit}>
        {job ? "Update Job" : "Post Job"}
      </button>
    </div>
  );
}