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
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import moment from "moment";
import Iconify from "../components/Iconify";

// components
import Page from "../components/Page";

// sections
import { Chart } from "../sections/@dashboard/app";
import Chart2 from "../sections/@dashboard/app/Chart2";
import { green, grey, red } from "@mui/material/colors";

// ----------------------------------------------------------------------

export default function OBC() {
  const [isObcError, setIsObcError] = useState(false);
  const [obcStatus, setObcStatus] = useState("The OBC is Operating Normally");
  const [isSysError, setIsSysError] = useState(false);
  const [systemStatus, setSystemStatus] = useState(
    "The System is Operating Normally"
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
          setObcStatus("The OBC is operating normally");
          setIsObcError(false);
        } else if (ob === "B\r") {
          setObcStatus(
            "Possible Reason: Temperature above the allowed threshold"
          );
          setIsObcError(true);
        } else if (ob === "C\r") {
          setObcStatus("Possible Reason: Current above the allowed threshold");
          setIsObcError(true);
        }
      } else if (arr[0] === "OS") {
        setBids((prevBids) => prevBids.concat(<br />, json));

        let os = arr[1];

        if (os === "A\r\n") {
         
          setSystemStatus("The System is operating normally");
          setIsSysError(false);
        } else if (os === "B\r\n") {
          setSystemStatus(
            "Unresponsive.\nPossible Reason: System software frozen."
          );
          setIsSysError(true);
        } else if (os === "C\r\n") {
          setSystemStatus("System failure.\nPossible Reason: Unknown");
          setIsSysError(true);
        }
      }
    };

    return () => ws.close();
  }, []);

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
                        icon={"material-symbols:monitor-heart-outline"}
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
                        icon={"material-symbols:emergency-home-outline"}
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
              subheader="OBC readings"
              date={date}
              chartData={[
                {
                  name: "Temperature",
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
