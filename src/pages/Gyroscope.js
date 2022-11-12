
import { Grid, Container, Typography, Card, CardHeader, Box } from '@mui/material';
import React, { useState, useEffect } from 'react';
import moment from 'moment';

// components
import Page from '../components/Page';

// sections
import {
  Chart,

} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function Gyroscope() {


  const [bids, setBids] = useState(['Waiting for connection...']);
 
  const [gyroscopeX, setgyroX] = useState([0]);
  const [gyroscopeY, setgyroY] = useState([0]);
  const [gyroscopeZ, setgyroZ] = useState([0]);
  const currentDate1 = new Date();
  const showDate1 = moment(currentDate1).format('HH:mm:ss');
  const [date, setDate] = useState(showDate1.toString());

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
     
     if(arr[0]==="G") {
        
        setgyroX((prevGyro)=> 
        prevGyro.concat(arr[1]))
        setgyroY((prevGyro)=> 
        prevGyro.concat(arr[2]))
        setgyroZ((prevGyro)=> 
        prevGyro.concat(arr[3]))
      }
     
      console.log(arr)
      setBids((prevBids)=> 
        prevBids.concat(<br/>, json))
    };

    return () => ws.close();
  }, []);

  return (
    <Page title="Dashboard | Gyroscope">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Gyroscope
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
          <Chart
              title="MPU6050 Gyroscope Sensor data"
              subheader="Gyroscope readings from the MPU6050 Sensor"
              date={date}
              chartData={[
               
                {
                  name: 'X axis',
                  type: 'area',
                  fill: 'gradient',
                  data: gyroscopeX,
      
                },
                {
                  name: 'Y axis',
                  type: 'area',
                  fill: 'gradient',
                  data: gyroscopeY,
      
                },
                {
                  name: 'Z axis',
                  type: 'area',
                  fill: 'gradient',
                  data: gyroscopeZ,
      
                },
               
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <Card>
              <CardHeader title="Websocket Readings" />

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
