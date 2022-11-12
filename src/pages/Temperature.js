import {
  Grid,
  Container,
  Typography,
  Card,
  CardHeader,
  Box,
  ListSubheader,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import moment from "moment";

// components
import Page from "../components/Page";

// sections
import { Chart } from "../sections/@dashboard/app";

// ----------------------------------------------------------------------

export default function Temperature() {
  const [bids, setBids] = useState(["Waiting for connection..."]);
  const [tempValues, setTempValues] = useState([0]);
  const currentDate1 = new Date();
  const showDate1 = moment(currentDate1).format("HH:mm:ss");
  const [date, setDate] = useState(showDate1.toString());

  const [fetchedtempValues, setFetchedTempValues] = useState([0]);
  const [fetchedTime, setFetchedTime] = useState([""]);
  const [fetchedDate, setFetchedDate] = useState([""]);

  useEffect(() => {
    const ws = new WebSocket("wss://nanosat.herokuapp.com");
    const currentDate = new Date();
    const showDate = moment(currentDate).format("HH:mm:ss");
    ws.onmessage = (event) => {
      const json = event.data;
      setDate(showDate.toString());
      let arr = [];
      if (json !== "Hello Server") {
        arr = json.split(",");
      }
      if (arr[0] === "T") {
        setTempValues((prevTemps) => prevTemps.concat(arr[1]));
      }


      setBids((prevBids) => prevBids.concat(<br />, json));
    };

    // fetch data from db
    fetch('https://nanosat.herokuapp.com/dashboard/getTempReadings')
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `This is an HTTP error: The status is ${response.status}`
        );
      }
      return response.json();
    }).then((data) => {
      Array.from(data.docs).forEach(element => {
        let date = element["date"];
        let time = element["time"];
        let val = element["temp"];
        setFetchedTempValues((prevTemps) => prevTemps.concat(val));
        setFetchedTime((prevTime) => prevTime.concat(time));
        setFetchedDate((prevDate) => prevDate.concat(date));
      });
    })
    .catch((err) => {
      console.log(err.message);
     });
    ;

    return () => ws.close();
  }, []);

  return (
    <Page title="Dashboard | Temperature">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Temperature
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <Chart
              title="MPU6050 Temperature data"
              subheader="Live Temperature readings from the MPU6050 Sensor"
              date={date}
              chartData={[
                {
                  name: "Temperature",
                  type: "column",
                  fill: "solid",
                  data: tempValues,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <Card
              sx={{
                width: "100%",

                position: "relative",
                overflow: "auto",
                maxHeight: 300,
                "& ul": { padding: 0 },
                
              }}
            >
              <ListSubheader sx={{ pl: 0 }}>
                <CardHeader
                  title="Websocket Readings"
                  sx={{ color: "black" }}
                />
              </ListSubheader>

              <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                {bids}
              </Box>
            </Card>
          </Grid>


          <Grid item xs={12} md={6} lg={8}>
            <Chart
              title="MPU6050 Temperature data"
              subheader="Fetched Temperature readings from the MPU6050 Sensor"
              date={fetchedTime}
              chartData={[
                {
                  name: "Temperature",
                  type: "column",
                  fill: "solid",
                  data: fetchedtempValues,
                },
              ]}
            />
          </Grid>





        </Grid>
      </Container>
    </Page>
  );
}
