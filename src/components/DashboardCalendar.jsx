import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import './css/DashboardCalendar.css';
import moment from "moment/moment";
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import DateRangeIcon from '@mui/icons-material/DateRange';

export default function DashboardCalendar({ onDateChange, refetch }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const today = moment().toDate(); // Get today's date as a Date object

  const handleStartDateChange = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD"); // Format date using moment
    setStartDate(formattedDate); 
    if (endDate && moment(date).isAfter(endDate)) {
      setEndDate(null); // Clear end date if the start date is after it
    }
    onDateChange(formattedDate, endDate);
  };

  const handleEndDateChange = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD"); // Format date using moment
    setEndDate(formattedDate);
    onDateChange(startDate, formattedDate);
  };

  const clearStartEndDate = () => {
    setStartDate(null);
    setEndDate(null);
    onDateChange(null, null);
    refetch(); // Refetch data when dates are cleared
  };

  return (
    <>
      <div className="nav-bar-dashboard-card">
        <Calendar
          id="startDate"
          value={startDate ? moment(startDate).toDate() : null}
          onChange={(e) => handleStartDateChange(e.value)}
          placeholder="Start Date"
          dateFormat="yy-mm-dd"
          className="nav-bar-dashboard-card-calendar"
          style={{ 
            outline: "none", 
            height: "100%", 
            color: "#fff",
            paddingInlineStart: "10px"
          }}
          inputStyle={{ backgroundColor: "transparent" }}
          maxDate={today} // Prevent selecting future dates
        />
        <EditCalendarIcon className="calendar-container-icon" />
      </div>
      <div className="nav-bar-dashboard-card">
        <Calendar
          id="endDate"
          value={endDate ? moment(endDate).toDate() : null}
          onChange={(e) => handleEndDateChange(e.value)}
          placeholder="End Date"
          dateFormat="yy-mm-dd"
          className="nav-bar-dashboard-card-calendar"
          style={{ 
            outline: "none", 
            height: "100%", 
            color: "#fff",
            paddingInlineStart: "10px",
          }}
          inputStyle={{ backgroundColor: "transparent" }}
          disabled={!startDate} // Disable end date calendar if start date is not selected
          minDate={startDate ? moment(startDate).toDate() : null} // Set minimum selectable date for end date
          maxDate={today} // Prevent selecting future dates
        />
        {!startDate ?
          <DateRangeIcon className="calendar-container-icon" />
        :
          <EditCalendarIcon className="calendar-container-icon" />
        }
      </div>
      <div className="nav-bar-dashboard-conainer-clean-btn" onClick={clearStartEndDate}>
        <EventBusyIcon />
      </div>
    </>
  );
}
