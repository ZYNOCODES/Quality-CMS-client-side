import { createTheme, ThemeProvider } from '@mui/material/styles';
import './css/DataTableStyle.css';
import MUIDataTable from "mui-datatables";
import { utils, write } from 'xlsx';
import { saveAs } from 'file-saver';
import { formatDuration } from '../../util/UseFullFunctions';
import { useState } from 'react';

const DataTable = (props) => {
    const [selectedRowIndexes, setSelectedRowIndexes] = useState([]);
    const options = {
        selectableRows: props.selectable ? "multiple" : false,
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
        rowsSelected: selectedRowIndexes,
        onRowSelectionChange: (currentRowsSelected, allRowsSelected, rowsSelectedIndexes) => {
            // Update selected row indexes
            setSelectedRowIndexes(rowsSelectedIndexes);

            // Get selected IDs based on selected rows
            const selectedIds = allRowsSelected.map(row => props.data[row.index].code);
            props.getSelectedPanneIDs(selectedIds);
        },
        onDownload: (buildHead, buildBody, columns, data) => {
            // Customize the headers
            const header = columns.map(column => column.label);
            const worksheet = utils.aoa_to_sheet([header]);

             // Convert data to array of arrays
             const rows = data.map((item) => {
                const row = props.data[item.index]; // Access the original data
                return columns.map((column) => {
                    const cellValue = row[column.name];

                    // Handle nested objects
                    if (column.name === 'workshopAssociation') {
                        return cellValue?.name || ''; 
                    }
                    if (column.name === 'typepanneAssociation') {
                        return cellValue?.name || ''; 
                    }
                    if (column.name === 'zoneAssociation') {
                        return cellValue?.name || ''; 
                    }
                    if (column.name === 'familyAssociation') {
                        return cellValue?.name || ''; 
                    }
                    if (column.name === 'lotAssociation') {
                        return cellValue?.name || ''; 
                    }
                    if (column.name === 'dureeDintervention') {
                        return formatDuration(cellValue) || ''; 
                    }
                    if (column.name === 'technicianAssociation') {
                        return cellValue?.fullname || ''; 
                    }
                    if (column.name === 'productAssociation') {
                        // Handle productAssociation fields
                        switch (column.label) {
                            case 'Marque':
                                return cellValue?.marque || '';
                            case 'Famille':
                                return cellValue?.familyAssociation?.name || '';
                            case 'Modele':
                                return cellValue?.model || '';
                            case 'Lot':
                                return cellValue?.lotAssociation?.name || '';
                            default:
                                return '';
                        }
                    }
                    if(column.name === 'correctiveActionNames') {
                        return cellValue.join(', ') || '';
                    }
                    if(column.name === 'consommationNames') {
                        return cellValue.join(', ') || '';
                    }
                    if(column.name === 'typePannesNames') {
                        return cellValue.join(', ') || '';
                    }
                    if (column.name === 'livraison') {
                        return cellValue ? 'Oui' : 'Non'; 
                    }
                    if (column.name === 'item') {
                        // Handle productAssociation fields
                        switch (column.label) {
                            case 'Produit':
                                return cellValue?.Modele || '';
                            case 'Nom':
                                return cellValue?.Nom || '';
                            default:
                                return '';
                        }
                    }

                    return cellValue ?? ''; // Return value or empty string for other columns
                });
            });

            // Add rows to the worksheet
            utils.sheet_add_aoa(worksheet, rows, { origin: 'A2' });

            // Create a new workbook
            const workbook = {
                Sheets: { 'Sheet1': worksheet },
                SheetNames: ['Sheet1']
            };

            // Convert workbook to binary array
            const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" });
            const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
            const fileExtension = ".xlsx";
            const fileName = props.title;

            // Create a Blob and save the file
            const dataBlob = new Blob([excelBuffer], { type: fileType });
            saveAs(dataBlob, fileName + fileExtension);

            // Cancel the default CSV download from the table
            return false;
        },
        
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
