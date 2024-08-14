import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import './styleUploadField.css';

const ButtonField = (props) => {
    return (
        <>
            <input type="file" id="file" multiple onChange={props.onChange}/>
            <label for='file' className='upload-label'>
                <CloudUploadIcon className='upload-icon'/>
            </label>
        </>
    );
};

export default ButtonField;
