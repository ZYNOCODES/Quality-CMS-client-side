import { createTheme, ThemeProvider } from '@mui/material/styles';
import './css/DataTableStyle.css';
import MUIDataTable from "mui-datatables";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { IconButton, Tooltip } from '@mui/material';


const DataTable = (props) => {
    const options = {
        selectableRows: false,
        elevation: 0,
        rowsPerPage: props.rows!= null ? props.rows : 11,
        rowsPerPageOptions: [props.rows!= null ? props.rows : 5, 8, 11, 20, 40],
        responsive: "vertical",
        searchPlaceholder: 'Rechercher',
        textLabels: {
            body: {
            noMatch: 'Désolé, aucune donnée correspondante trouvée',
            }
        },
        print: false,
        download: props.download,
        viewColumns: props.viewColumns,
        filter: props.filter,
        search: props.search
    };
    const getMUITheme = () => createTheme({
        typography: {
            // fontFamily: "Poppins",
        },
        palette: {
            background: {
                paper: "#fff",
                default: "#f9f9f9"
            },
            mode: "light"
        },
        components: {
            MuiPaper: {
                styleOverrides: {
                    root: {
                        boxShadow: "none",
                    }
                }
            },
            MuiTableCell: {
                styleOverrides: {
                    head: {
                        padding: "10px 4px",
                        alignItems: "center",
                    },
                    body: {
                        padding: "7px 15px",
                        color: "#000",
                    }
                }
            }
        }
    });

    return (
        <ThemeProvider theme={getMUITheme()}>
            <MUIDataTable
                data={props.data}
                columns={props.columns}
                options={options}
            />
        </ThemeProvider>
    );
}
export default DataTable;
