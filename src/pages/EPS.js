import {
  Grid,
  Container,
  Typography,
  Card,
  CardHeader,
  Box,
  ListSubheader,
} from "@mui/material";

import BatteryGauge from "react-battery-gauge";
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

  const [socValues, setSocValues] = useState([100]);
  const [charge, setCharge] = useState(100);
  const [v1Values, setV1Values] = useState([0]);
  const [i1Values, setI1Values] = useState([0]);
  const [p1Values, setP1Values] = useState([0]);
  const [v2Values, setV2Values] = useState([0]);
  const [i2Values, setI2Values] = useState([0]);
  const [p2Values, setP2Values] = useState([0]);
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
      
      if (arr[0] === "SoC") {
        setBids((prevBids) => prevBids.concat(<br />, json));
        arr.pop();
        let finalArr = arr;
        finalArr.shift();
        console.log(finalArr);
        for (let i = 0; i < finalArr.length; i++) {
          setSocValues((prevVals) => prevVals.concat(finalArr[i]));
          
        }

        setCharge(parseInt(finalArr[0]));
        
      } else if (arr[0] === "V1") {
        setBids((prevBids) => prevBids.concat(<br />, json));
        arr.pop();
        let finalArr = arr;
        finalArr.shift();

        for (let i = 0; i < finalArr.length; i++) {
          setV1Values((prevVals) => prevVals.concat(finalArr[i]));
        }
      } 
      else if (arr[0] === "I1") {
        setBids((prevBids) => prevBids.concat(<br />, json));
        arr.pop();
        let finalArr = arr;
        finalArr.shift();

        for (let i = 0; i < finalArr.length; i++) {
          setI1Values((prevVals) => prevVals.concat(finalArr[i]));
        }
      } 
      else if (arr[0] === "P1") {
        setBids((prevBids) => prevBids.concat(<br />, json));
        arr.pop();
        let finalArr = arr;
        finalArr.shift();

        for (let i = 0; i < finalArr.length; i++) {
          setP1Values((prevVals) => prevVals.concat(finalArr[i]));
        }
      } 
      else if (arr[0] === "V2") {
        setBids((prevBids) => prevBids.concat(<br />, json));
        arr.pop();
        let finalArr = arr;
        finalArr.shift();

        for (let i = 0; i < finalArr.length; i++) {
          setV2Values((prevVals) => prevVals.concat(finalArr[i]));
        }
      } 
      else if (arr[0] === "I2") {
        setBids((prevBids) => prevBids.concat(<br />, json));
        arr.pop();
        let finalArr = arr;
        finalArr.shift();

        for (let i = 0; i < finalArr.length; i++) {
          setI2Values((prevVals) => prevVals.concat(finalArr[i]));
        }
      } 
      else if (arr[0] === "P2") {
        setBids((prevBids) => prevBids.concat(<br />, json));
        arr.pop();
        let finalArr = arr;
        finalArr.shift();

        for (let i = 0; i < finalArr.length; i++) {
          setP2Values((prevVals) => prevVals.concat(finalArr[i]));
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
          <Card
            sx={{
             
              maxHeight: 300,
         
            }}
          >
            <CardHeader title="State of Charge" sx={{ color: "black" }} />
            <div><p>{charge} %</p>
              </div>
            <BatteryGauge animated={true} padding={6} value={charge} />
          </Card>
        </Grid>
        </Grid>

        <Grid marginTop={1} container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <Chart2
              title="EPS data"
              subheader="Live EPS readings"
              date={date}
              chartData={[
                {
                  name: "P1 Power",
                  type: "area",
                  fill: "gradient",
                  data: p1Values,
                },
                {
                  name: "V1 Load Voltage",
                  type: "area",
                  fill: "gradient",
                  data: v1Values,
                },
                {
                  name: "I1 Supply Current",
                  type: "area",
                  fill: "gradient",
                  data: i1Values,
                },
                {
                  name: "V2 Load Voltage",
                  type: "area",
                  fill: "gradient",
                  data: v2Values,
                },
                {
                  name: "I2 Load Current",
                  type: "area",
                  fill: "gradient",
                  data: i2Values,
                },
                {
                  name: "P2 Power",
                  type: "area",
                  fill: "gradient",
                  data: p2Values,
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
