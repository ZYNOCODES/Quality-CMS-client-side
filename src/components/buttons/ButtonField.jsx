import './styleButtonField.css';
import DeleteIcon from '@mui/icons-material/Delete';
import AddLinkIcon from '@mui/icons-material/AddLink';

const ButtonField = ({ text, onClick, color, backgroundColor, fontSize, icon }) => {
    return (
        <div className='TVDetails-content-navbar-buttons' onClick={onClick}
            style={{
                color: color, 
                backgroundColor: backgroundColor, 
                fontSize: fontSize,
            }}
        >
            <h1>{text}</h1>
            {icon === 'delete' &&
                <DeleteIcon className='navbar-buttons-delete-icon'/>
            }
            {icon === 'link' &&
                <AddLinkIcon className='navbar-buttons-delete-icon'/>
            }
        </div>
    );
};

export default ButtonField;
