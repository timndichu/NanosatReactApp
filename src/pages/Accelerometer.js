
// @mui

import { Grid, Container, Typography, Card, CardHeader, Box,  ListSubheader } from '@mui/material';
import React, { useState, useEffect } from 'react';
import moment from 'moment';

// components
import Page from '../components/Page';

// sections
import {

 
  Chart,

} from '../sections/@dashboard/app';
import Chart2 from '../sections/@dashboard/app/Chart2';

// ----------------------------------------------------------------------

export default function Accelerometer() {
  

  const [bids, setBids] = useState(['Waiting for connection...']);
  const [accelerometerX, setaccelerometerX] = useState([0]);
  const [accelerometerY, setaccelerometerY] = useState([0]);
  const [accelerometerZ, setaccelerometerZ] = useState([0]);
  const currentDate1 = new Date();
  const showDate1 = moment(currentDate1).format('HH:mm:ss');
  const [date, setDate] = useState(showDate1.toString());

  const [fetchedAccelerometerX, setfetchedAccelerometerX] = useState([0]);
  const [fetchedAccelerometerY, setfetchedAccelerometerY] = useState([0]);
  const [fetchedAccelerometerZ, setfetchedAccelerometerZ] = useState([0]);

  const [fetchedTime, setFetchedTime] = useState([""]);
  const [fetchedDate, setFetchedDate] = useState([""]);

  useEffect(() => {
    const ws = new WebSocket('wss://nanosat.herokuapp.com');
    const currentDate = new Date();
    const showDate = moment(currentDate).format('HH:mm:ss');
    ws.onmessage = (event) => {
      const json = event.data;
        setDate(showDate.toString())
         let arr = [];
      if(json!=="Hello Server") {
        arr = json.split(',')
      }
     
     if(arr[0]==="A") {
        setaccelerometerX((prevAcc)=> 
        prevAcc.concat(arr[1]))
        setaccelerometerY((prevAcc)=> 
        prevAcc.concat(arr[2]))
        setaccelerometerZ((prevAcc)=> 
        prevAcc.concat(arr[3]))
      }
      console.log(arr)
      setBids((prevBids)=> 
        prevBids.concat(<br/>, json))
    };

    fetch('https://nanosat.herokuapp.com/dashboard/getAccReadings')
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `This is an HTTP error: The status is ${response.status}`
        );
      }
      return response.json();
    }).then((data) => {
      Array.from(data.docs).forEach(element => {
        console.log(element);
        let xAxis = element["xAxis"];
        let yAxis = element["yAxis"];
        let zAxis = element["zAxis"];
        let ourTime = xAxis.time;
        let ourDate = xAxis.date;
        
        setfetchedAccelerometerX((prevAcc)=> 
        prevAcc.concat(xAxis.val))
        setfetchedAccelerometerY((prevAcc)=> 
        prevAcc.concat(yAxis.val))
        setfetchedAccelerometerZ((prevAcc)=> 
        prevAcc.concat(zAxis.val))

        setFetchedTime((prevTime) => prevTime.concat(ourTime));
        setFetchedDate((prevDate) => prevDate.concat(ourDate));
      });
    })
    .catch((err) => {
      console.log(err.message);
     });

    return () => ws.close();
  }, []);

  return (
    <Page title="Dashboard | Accelerometer">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Accelerometer
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <Chart2
              title="MPU6050 Accelerometer Sensor data"
              subheader="Accelerometer readings from the MPU6050 Sensor"
              date={date}
              chartData={[
               
                {
                  name: 'X axis',
                  type: 'area',
                  fill: 'gradient',
                  data: accelerometerX,
      
                },
                {
                  name: 'Y axis',
                  type: 'area',
                  fill: 'gradient',
                  data: accelerometerY,
      
                },
                {
                  name: 'Z axis',
                  type: 'area',
                  fill: 'gradient',
                  data: accelerometerZ,
      
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
              title="MPU6050 Accelerometer Sensor data"
              subheader="Fetched Accelerometer readings from the database"
              date={fetchedTime}
              chartData={[
               
                {
                  name: 'X axis',
                  type: 'area',
                  fill: 'gradient',
                  data: fetchedAccelerometerX,
      
                },
                {
                  name: 'Y axis',
                  type: 'area',
                  fill: 'gradient',
                  data: fetchedAccelerometerY,
      
                },
                {
                  name: 'Z axis',
                  type: 'area',
                  fill: 'gradient',
                  data: fetchedAccelerometerZ,
      
                },
               
              ]}
            />
          </Grid>

         
        </Grid>
      </Container>
    </Page>
  );
}
