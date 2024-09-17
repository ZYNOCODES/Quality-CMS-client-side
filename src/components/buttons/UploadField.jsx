import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import './styleUploadField.css';

const ButtonField = (props) => {
    return (
        <>
            <label htmlFor="dropzone-file" className="dropzone-file-content">
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px"
                    }}
                >
                    <svg
                        style={{
                            width: "20%",
                            color: "#DA171B"
                        }}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                    </svg>
                    <p>
                        <span style={{
                            fontWeight: "700"
                        }}>Cliquez pour joindre</span> or drag and drop
                    </p>
                    <p 
                        style={{
                            color: "#989898",
                            fontWeight: "400"
                        }}
                    >Excel format</p>
                    {props.fileName && 
                        <p
                            style={{
                                color: "#989898",
                                fontWeight: "400"
                            }}
                        >
                            {props.fileName}
                        </p>
                    }
                </div>
                <input id="dropzone-file" onChange={props.onChange}  type="file" className="hidden" />
            </label>
        </>
    );
};

export default ButtonField;
