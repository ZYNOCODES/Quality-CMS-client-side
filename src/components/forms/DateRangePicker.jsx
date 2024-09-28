import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

export default function BasicDateRangePicker({
    onChange,
}) {
    const handleDateChange = (newValue) => {
        if (newValue && onChange) {
            const startDate = newValue[0] ? newValue[0].format('YYYY-MM-DD') : null; // Format start date
            const endDate = newValue[1] ? newValue[1].format('YYYY-MM-DD') : null;   // Format end date
            
            onChange({
              startDate,
              endDate,
            });
        }
      };
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DateRangePicker']}>
            <DateRangePicker 
                localeText={{ start: 'Date debut', end: 'Date fin' }} 
                onChange={handleDateChange} 
            />
        </DemoContainer>
        </LocalizationProvider>
    );
}