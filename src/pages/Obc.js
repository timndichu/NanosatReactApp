import {
  Grid,
  Container,
  Typography,
  Card,
  CardHeader,
  Box,
  Badge,
  Avatar,
  ListSubheader,
} from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { styled } from "@mui/material/styles";
import moment from "moment";
import Iconify from "../components/Iconify";

// components
import Page from "../components/Page";

// sections
import { Chart } from "../sections/@dashboard/app";
import Chart3 from "../sections/@dashboard/app/Chart3";
import { green, grey, red } from "@mui/material/colors";
import Chart2 from "../sections/@dashboard/app/Chart2";
import SatelliteContext from "../store/satellite-context";

// ----------------------------------------------------------------------

export default function OBC() {
  const ctx = useContext(SatelliteContext);
  
  const [isObcError, setIsObcError] = useState(ctx.isObcError);
  const [obcStatus, setObcStatus] = useState(ctx.obcStatus);
  const [isSysError, setIsSysError] = useState(ctx.isSysError);
  const [systemStatus, setSystemStatus] = useState(
  ctx.systemStatus
  );

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: isObcError ? "#c31432" : "#38ef7d",
      // backgroundColor: theme,
      color: "#fff",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  }));

  const StyledBadge2 = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: isSysError ? "#c31432" : "#38ef7d",
      // backgroundColor: theme,
      color: "#fff",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  }));
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
      } else if (arr[0] === "OC") {
        setBids((prevBids) => prevBids.concat(<br />, json));
        arr.pop();
        let finalArr = arr;
        finalArr.shift();

        for (let i = 0; i < finalArr.length; i++) {
          setCurrValues((prevCurr) => prevCurr.concat(finalArr[i]));
        }
      } else if (arr[0] === "OL") {
        setBids((prevBids) => prevBids.concat(<br />, json));
        arr.pop();
        let finalArr = arr;
        finalArr.shift();

        for (let i = 0; i < finalArr.length; i++) {
          setVoltageValues((prevVol) => prevVol.concat(finalArr[i]));
        }
      } else if (arr[0] === "OB") {
        setBids((prevBids) => prevBids.concat(<br />, json));

        const ob = arr[1];

        if (ob === "A\r") {
          ctx.setIsObcError(false);
          ctx.setObcStatus("The OBC is operating normally");
          setObcStatus("The OBC is operating normally");
          setIsObcError(false);
        } else if (ob === "B\r") {
          ctx.setObcStatus(
            "Possible Reason: Temperature above the allowed threshold"
          );
          setObcStatus(
            "Possible Reason: Temperature above the allowed threshold"
          );
          ctx.setIsObcError(true);
          setIsObcError(true);
        } else if (ob === "C\r") {
          ctx.setObcStatus("Possible Reason: Current above the allowed threshold");
          setObcStatus("Possible Reason: Current above the allowed threshold");
          ctx.setIsObcError(true);
          setIsObcError(true);
        }
      } else if (arr[0] === "OS") {
        setBids((prevBids) => prevBids.concat(<br />, json));

        let os = arr[1];

        if (os === "A\r\n") {
          ctx.setSystemStatus("The System is operating normally");
          setSystemStatus("The System is operating normally");
          ctx.setIsSysError(false);
          setIsSysError(false);
        } else if (os === "B\r\n") {
          ctx.setSystemStatus(
            "Unresponsive.\nPossible Reason: System software frozen."
          );
          setSystemStatus(
            "Unresponsive.\nPossible Reason: System software frozen."
          );
          ctx.setIsSysError(true);
          setIsSysError(true);
        } else if (os === "C\r\n") {
          ctx.setSystemStatus("System failure.\nPossible Reason: Unknown");
          setSystemStatus("System failure.\nPossible Reason: Unknown");
          ctx.setIsSysError(true);
          setIsSysError(true);
        }
      }
    };

    return () => ws.close();
  }, [ctx]);

  return (
    <Page title="Dashboard | OBC">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          OBC (On Board Computer)
        </Typography>

        <Grid container justifyContent="flex-start" alignItems="left">
          <Grid item xs={12} md={6} lg={4}>
            <Card
              sx={{
                mb: 2,
                position: "relative",
                overflow: "auto",
                maxHeight: 300,
                maxWidth: 300,
                "& ul": { padding: 0 },
              }}
            >
              <CardHeader title="OBC Status" />

              <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                <Box component="div" sx={{ display: "inline" }}>
                  <StyledBadge
                    sx={{ mr: 1 }}
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    <Avatar
                      sx={{
                        backgroundColor: isObcError ? red[500] : green[500],
                      }}
                    >
                      <Iconify
                          icon= { isObcError ? "material-symbols:emergency-home-outline" : "material-symbols:monitor-heart-outline"}
                      />
                    </Avatar>
                  </StyledBadge>
                  <Typography
                    color={isObcError ? red[500] : green[500]}
                    display="inline"
                    variant="subtitle1"
                  >
                    {isObcError ? "Emergency Mode" : "Normal Mode"}
                  </Typography>

                  <Typography
                    color={grey[500]}
                    variant="caption"
                    display="block"
                  >
                    {obcStatus}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <Card
              sx={{
                mb: 2,
                position: "relative",
                overflow: "auto",
                maxHeight: 300,
                maxWidth: 300,
                "& ul": { padding: 0 },
              }}
            >
              <CardHeader title="System 1 Status" />

              <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                <Box component="div" sx={{ display: "inline" }}>
                  <StyledBadge2
                    sx={{ mr: 1 }}
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    <Avatar
                      sx={{
                        backgroundColor: isSysError ? red[500] : green[500],
                      }}
                    >
                      <Iconify
                        icon= { isSysError ? "material-symbols:emergency-home-outline" : "material-symbols:monitor-heart-outline"}
                      />
                    </Avatar>
                  </StyledBadge2>
                  <Typography
                    color={isSysError ? red[500] : green[500]}
                    display="inline"
                    variant="subtitle1"
                  >
                    {isSysError ? "Emergency Mode" : "Normal Mode"}
                  </Typography>
                </Box>

                <Typography color={grey[500]} variant="caption" display="block">
                  {systemStatus}
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <Chart2
              title="OBC data"
              subheader="Live OBC readings"
              date={date}
              chartData={[
                {
                  name: "Temperature",
                  type: "area",
                  fill: "gradient",
                  data: tempValues,
                  symbol: "°C"
                },
                {
                  name: "Load Voltage",
                  type: "area",
                  fill: "gradient",
                  data: voltageValues,
                  symbol: "V"
                },
                {
                  name: "Current Values",
                  type: "area",
                  fill: "gradient",
                  data: currValues,
                  symbol: "mA"
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
            <Chart3
              title="Temperature data"
              subheader="Live Temperature readings"
              date={date}
              chartData={[
                {
                  name: "Temperature",
                  type: "area",
                  fill: "gradient",
                  data: tempValues,
                  symbol: "°C"
                },
               
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <Chart3
              title="Load Voltage data"
              subheader="Live Voltage readings"
              date={date}
              chartData={[
              
                {
                  name: "Load Voltage",
                  type: "area",
                  fill: "gradient",
                  data: voltageValues,
                  symbol: "V"
                },
                
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <Chart3
              title="Current data"
              subheader="Live Current readings"
              date={date}
              chartData={[
               
                {
                  name: "Current Values",
                  type: "area",
                  fill: "gradient",
                  data: currValues,
                  symbol: "mA"
                },
              ]}
            />
          </Grid>


        </Grid>
      </Container>
    </Page>
  );
}
