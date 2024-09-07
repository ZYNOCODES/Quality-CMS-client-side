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
        search: props.search,
        onDownload: (buildHead, buildBody, columns, data) => {
            // Customize the headers
            buildHead = () => {
                return columns.map(column => column.label).join(',') + '\n'; // Dynamic column headers
            };
            //console.log("Data passed to onDownload:", data);
            // Customize the body (handle nested objects and undefined values)
            buildBody = () => {
                return data
                    .map((item) => {
                        //console.log("Current dataIndex:", item.index); // Log the dataIndex to ensure it exists
                        const row = props.data[item.index]; // Access the original data
                        // Safely map over columns and extract values
                        return columns
                            .map((column) => {
                                const cellValue = row[column.name];
        
                                // Handle nested object for workshopAssociation
                                if (column.name === 'workshopAssociation') {
                                    return cellValue?.name || ''; 
                                }
                                // Handle nested object for typepanneAssociation
                                if (column.name === 'typepanneAssociation') {
                                    return cellValue?.name || ''; 
                                }
                                // Handle nested object for zoneAssociation
                                if (column.name === 'zoneAssociation') {
                                    return cellValue?.name || ''; 
                                }
                                // Handle nested object for familyAssociation
                                if (column.name === 'familyAssociation') {
                                    return cellValue?.name || ''; 
                                }

                                return cellValue ?? ''; // Return value or empty string for other columns
                            })
                            .join(','); // Join row data with commas
                    })
                    .join('\n'); // Join all rows with newlines
            };
        
            return "\uFEFF" + buildHead() + buildBody(); // Return the formatted CSV string
        }
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
