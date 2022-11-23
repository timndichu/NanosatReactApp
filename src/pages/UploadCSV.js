import { useState, React, useRef } from "react";
import axios from "axios";

import {
  Grid,
  Container,
  Typography,
  Card,
  Button,
  Box,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContentText,
  DialogContent,
} from "@mui/material";
import Iconify from "../components/Iconify";
import Papa from "papaparse";
// components
import Page from "../components/Page";

// sections

// ----------------------------------------------------------------------

export default function UploadCSV() {
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const hiddenFileInput = useRef(null);
  const [openDialog, setOpenDialog] = useState(false);

  // State to store parsed data
  const [parsedData, setParsedData] = useState([]);

  //State to store table Column name
  const [tableRows, setTableRows] = useState([]);

  //State to store the values
  const [values, setValues] = useState([]);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };
  const handleChange = (event) => {
    if (event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setIsFilePicked(true);
      Papa.parse(event.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const rowsArray = [];
          const valuesArray = [];

          // Iterating data to get column name and their values
          results.data.map((d) => {
            rowsArray.push(Object.keys(d));
            valuesArray.push(Object.values(d));
          });

          // Parsed Data Response in array format
          setParsedData(results.data);

          // Filtered Column Names
          setTableRows(rowsArray[0]);

          // Filtered Values
          setValues(valuesArray);
        },
      });
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    const url = "https://nanosat.herokuapp.com/dashboard/uploadCSV";
    const formData = new FormData();
    formData.append("csvFile", selectedFile, selectedFile.name);

    axios({
      method: "post",
      url,
      data: formData,
    })
      .then((response) => {
        setIsLoading(false);
        setOpenDialog(true);
        console.log(response.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <Page title="Upload CSV">
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Success"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Successfully Uploaded CSV!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Upload CSV
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader title="Click on button to upload CSV" />

                <Box sx={{ p: 3, pb: 3 }} dir="ltr">
                  <Button
                    disabled={isLoading}
                    variant="contained"
                    onClick={handleClick}
                    startIcon={<Iconify icon="eva:plus-fill" />}
                  >
                    Upload CSV
                  </Button>
                  <input
                    type="file"
                    name="csvFile"
                    accept=".csv"
                    ref={hiddenFileInput}
                    onChange={handleChange}
                    style={{ display: "none" }}
                  />
                </Box>
                <Box sx={{ pl: 3, pb: 3 }} dir="ltr">
                  {isFilePicked ? (
                    <>
                      <p>Filename: {selectedFile.name}</p>
                      <p>{selectedFile.size} bytes</p>
                      {isLoading ? (
                        <CircularProgress color="success" />
                      ) : (
                        <Button
                          variant="contained"
                          type="submit"
                          color="submitButton"
                          startIcon={<Iconify icon="iconoir:submit-document" />}
                        >
                          Submit CSV
                        </Button>
                      )}
                    </>
                  ) : (
                    <p>No File Uploaded</p>
                  )}
                </Box>
              </Card>
            </form>
            {tableRows.length >0 ? 
            <Card sx={{p: 3, mt:2}}>
              <table style={{ border: 'solid 1px black' }}>
                <thead>
                  <tr>
                    {tableRows.map((rows, index) => {
                      return <th  style={{
                        padding: '5px',
                        border: 'solid 3px black',
                        color: 'black',
                      }} key={index}>{rows}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {values.map((value, index) => {
                    return (
                      <tr key={index}>
                        {value.map((val, i) => {
                          return <td  style={{
                            padding: '10px',
                            border: 'solid 1px gray',
                          }} key={i}>{val}</td>;
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
            : <div></div> }
           
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
