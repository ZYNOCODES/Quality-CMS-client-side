import { useEffect, useState } from 'react';
import './textFieldstyle.css'
import validator from 'validator';

const TextFieldComponent = ({ 
    type = 'text', label = 'Text', DefaultValue = '',
    initialHelperText = 'Enter text', 
    minLength = 4, maxLength = 15, 
    onChange, obligatory, color, readOnly=false}) => {

    const [value, setValue] = useState('');
    const [error, setError] = useState(false);
    const [helperText, setHelperText] = useState("");

    useEffect(() => {

        const validateEmail = () => {
            if (value.length <= 0) {
                setError(false);
                setHelperText("");
            } else if (!validator.isEmail(value)) {
                setError(true);
                setHelperText('Enter a valid email address');
            } else {
                setError(false);
                setHelperText("");
            }
        };

        const validatePassword = () => {
            if (value.length <= 0) {
                setError(false);
                setHelperText("");
            } else if (value.length < minLength) {
                setError(true);
                setHelperText(`The password must be at least ${minLength} characters long`);
            } else if (value.length > maxLength) {
                setError(true);
                setHelperText(`The password must not exceed ${maxLength} characters`);
            } else if(!validator.isStrongPassword(value)) {
                setError(true);
                setHelperText('The password must contain at least one uppercase letter, one lowercase letter, one number and one special character');
            } else {
                setError(false);
                setHelperText("");
            }
        };

        if (type === 'email') {
            validateEmail();
        } else if (type === 'password') {
            validatePassword();
        }
    }, [value, type, minLength, maxLength, initialHelperText]);
    const handleChange = (e) => {
        setValue(e.target.value);
        onChange(e);
    };
    
    return (
        <div className='input-text-field-container'>
            <label style={{ color: color}} className={`input-text-field-label ${error ? 'error' : ''}`} >
                {label} {obligatory ? "*" : ''}:
            </label>
            <input
                className={`input-text-field-form ${error ? 'error' : ''}`}
                type={type}
                value={readOnly ? DefaultValue : value}
                onChange={handleChange}
                placeholder={initialHelperText}
                readOnly={readOnly}
            />
            <span className="input-text-field-helper-text">{helperText}</span>
        </div>
    );
};

export default TextFieldComponent;
