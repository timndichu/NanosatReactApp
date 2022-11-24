// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import SatelliteContext from './store/satellite-context';
import React, { useState } from "react";
// ----------------------------------------------------------------------

export default function App() {

      const [isObcError, setIsObcError] = useState(false);
    const [obcStatus, setObcStatus] = useState("The OBC is Operating Normally");
    const [isSysError, setIsSysError] = useState(false);
    const [systemStatus, setSystemStatus] = useState("The System is Operating Normally"
    );
    const [charge, setCharge] = useState(100);


  return (
    <SatelliteContext.Provider value={{isObcError, setIsObcError, obcStatus,setObcStatus,isSysError, setIsSysError, systemStatus,setSystemStatus,charge,setCharge }}>
      <ThemeProvider>
       <ScrollToTop />
      <BaseOptionChartStyle />
      <Router />
    </ThemeProvider>
    </SatelliteContext.Provider>
    
  );
}
