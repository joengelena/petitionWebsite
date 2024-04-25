import axios from 'axios';
import React from "react";
import {Link, useParams} from 'react-router-dom';
import CSS from 'csstype';
import {
    Alert, AlertTitle,
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Paper, Snackbar, Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {useUserInfoStorage} from "../store";
const baseUrl = "http://localhost:4941/api/v1";


const card: CSS.Properties = {
    padding: "10px",
    margin: "20px",
}

interface HeadCell {
    id: string;
    label: string;
    numeric: boolean;
}
const headCells: readonly HeadCell[] = [
    { id: 'petitionId', label: 'id', numeric: true },
    { id: 'title', label: 'Title', numeric: false },
    { id: 'categoryId', label: 'Category Id', numeric: true },
    { id: 'ownerId', label: 'Owner Id', numeric: true }
];

const Petitions = ()=> {
    const {id} = useParams();
    const [petitions, setPetitions] = React.useState<Array<Petition>>([]);
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    // const setTokenToStorage = useUserInfoStorage(state => state.setToken);
    // const setUserIdToStorage = useUserInfoStorage(state => state.setUserId);
    // const token = useUserInfoStorage(state => state.token);
    // const userId = useUserInfoStorage(state => state.userId);

    React.useEffect(() => {
        getPetitions();
    });

    const getPetitions = () => {
        axios.get(baseUrl + "/petitions").then(
            (response) => {
                setErrorFlag(false);
                setErrorMessage("");
                setPetitions(response.data.petitions);
            },
            (error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            }
        );
    };
    const petition_rows = () => {
        return petitions.map((row: Petition) =>
            <TableRow hover
                      tabIndex={-1}
                      key={row.petitionId}>
                <TableCell>
                    {row.petitionId}
                </TableCell>
                <TableCell align="right">{row.title}</TableCell>
                <TableCell align="right"><Link
                    to={"/petitions/" + row.petitionId}>Go to petitions</Link></TableCell>
                <TableCell align="right">
                    <Button variant="outlined" endIcon={<EditIcon />} onClick={() => {
                    }}>
                        Edit
                    </Button>
                    <Button variant="outlined" endIcon={<DeleteIcon />} onClick={() => {
                    }}>
                        Delete
                    </Button>
                </TableCell>
            </TableRow>
        )
    }

    if (errorFlag) {
        return (
            <div>
                <h1>Petitions</h1>
                {errorFlag &&
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>}
            </div>
        )
    } else {
        return (
            <div>
                <Paper elevation={3} style={card}>
                    <h1>Petitions</h1>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {headCells.map((headCell) => (
                                        <TableCell
                                            key={headCell.id}
                                            align={headCell.numeric ? 'right' :
                                                'left'}
                                            padding={'normal'}>
                                            {headCell.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {petition_rows()}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </div>

        )
    }

}
export default Petitions;