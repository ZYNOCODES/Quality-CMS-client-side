import { useState } from 'react';
import "./selectFieldstyle.css"

const SelectFieldComponent = ({
  label = 'Select',
  initialHelperText = 'Please select an option',
  options = [],
  optionName = 'name',
  onChange, obligatory}) => {
  const [value, setValue] = useState('');
  const [helperText, setHelperText] = useState("");


  const handleChange = (e) => {
      setValue(e.target.value);
      onChange(e);
  };

  return (
    <div className='input-select-field-container'>
      <label className='input-select-field-label'>
        {label} {obligatory ? '*' : ''}:
      </label>
      <select
        className='input-select-field-form'
        value={value}
        onChange={handleChange}
      >
        <option value="" disabled>{options.length === 0 ? 'Aucune option disponible' : initialHelperText}</option>
        {options.map((option, index) => (
          <option key={index} value={option.id}>
            {option[optionName]}
          </option>
        ))}
      </select>
      <span className="input-select-field-helper-text">{helperText}</span>
    </div>
  );
};

export default SelectFieldComponent;
