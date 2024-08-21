import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import "primereact/resources/themes/saga-blue/theme.css"; // Import your theme
import "primereact/resources/primereact.min.css"; // Import PrimeReact core styles
import "primeicons/primeicons.css"; // Import PrimeIcons
import './css/DashboardCalendar.css';
import EventBusyIcon from '@mui/icons-material/EventBusy';

export default function DashboardCalendar({ onDateChange, refetch }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const today = new Date(); // Get today's date

  const handleStartDateChange = (date) => {
    setStartDate(date); 
    if (endDate && date > endDate) {
      setEndDate(null); // Clear end date if it is before the new start date
    }
    onDateChange(date, endDate);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    onDateChange(startDate, date);
  };
  const ClearStartEndDate = () => {
    setStartDate(null);
    setEndDate(null);
    onDateChange(null, null);
    refetch();
  }
  return (
    <>
      <div className="nav-bar-dashboard-card">
        <Calendar
          id="startDate"
          value={startDate}
          onChange={(e) => handleStartDateChange(e.value)}
          showIcon
          placeholder="Start Date"
          dateFormat="yy-mm-dd"
          className="nav-bar-dashboard-card-calendar"
          style={{ outline: "none" }}
          maxDate={today} // Prevent selecting future dates
        />
      </div>
      <div className="nav-bar-dashboard-card">
        <Calendar
          id="endDate"
          value={endDate}
          onChange={(e) => handleEndDateChange(e.value)}
          showIcon
          placeholder="End Date"
          dateFormat="yy-mm-dd"
          className="nav-bar-dashboard-card-calendar"
          disabled={!startDate} // Disable end date calendar if start date is not selected
          minDate={startDate} // Set minimum selectable date for end date calendar
          maxDate={today} // Prevent selecting future dates
        />
      </div>
      <div className="nav-bar-dashboard-conainer-clean-btn" onClick={ClearStartEndDate}>
        <EventBusyIcon />
      </div>
    </>
  );
}
