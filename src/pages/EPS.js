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
import Chart2 from "../sections/@dashboard/app/Chart2";

// ----------------------------------------------------------------------

export default function EPS() {
  const [bids, setBids] = useState(["Waiting for connection..."]);

  const [tempValues, setTempValues] = useState([0]);
  const [currValues, setCurrValues] = useState([0]);
  const [voltageValues, setVoltageValues] = useState([0]);
  const currentDate1 = new Date();
  const showDate1 = moment(currentDate1).format("HH:mm:ss");
  const [date, setDate] = useState(showDate1.toString());

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

      if (arr[0] === "OT") {
        setBids((prevBids) => prevBids.concat(<br />, json));
        arr.pop();
        let finalArr = arr;
        finalArr.shift();

        for (let i = 0; i < finalArr.length; i++) {
          setTempValues((prevTemps) => prevTemps.concat(finalArr[i]));
        }
      }
      else  if (arr[0] === "OC") {
        setBids((prevBids) => prevBids.concat(<br />, json));
        arr.pop();
        let finalArr = arr;
        finalArr.shift();

        for (let i = 0; i < finalArr.length; i++) {
          setCurrValues((prevCurr) => prevCurr.concat(finalArr[i]));
        }
        
      }

      else  if (arr[0] === "OL") {
        setBids((prevBids) => prevBids.concat(<br />, json));
        arr.pop();
        let finalArr = arr;
        finalArr.shift();

        for (let i = 0; i < finalArr.length; i++) {
          setVoltageValues((prevVol) => prevVol.concat(finalArr[i]));
        }
      }

   
    };

    return () => ws.close();
  }, []);

  return (
    <Page title="Dashboard | EPS">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          EPS (Electrical Power System)
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <Chart2
              title="EPS data"
              subheader="EPS readings"
              date={date}
              chartData={[
                {
                  name: "Power Values",
                  type: "area",
                  fill: "gradient",
                  data: tempValues,
                },
                {
                  name: "Load Voltage",
                  type: "area",
                  fill: "gradient",
                  data: voltageValues,
                },
                {
                  name: "Current Values",
                  type: "area",
                  fill: "gradient",
                  data: currValues,
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
        </Grid>
      </Container>
    </Page>
  );
}
