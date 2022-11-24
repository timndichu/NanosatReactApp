import React from "react";

// const [isObcError, setIsObcError] = useState(false);
//   const [obcStatus, setObcStatus] = useState("The OBC is Operating Normally");
//   const [isSysError, setIsSysError] = useState(false);
//   const [systemStatus, setSystemStatus] = useState(
//     "The System is Operating Normally"
//   );

const SatelliteContext = React.createContext({
    isObcError: false,
    setIsObcError: (state) => {},
    obcStatus: "The OBC is Operating Normally",
    setObcStatus: (state) => {},
    isSysError: false,
    setIsSysError:(state) => {},
    systemStatus: "The System is Operating Normally",
    setSystemStatus:(state) => {},
    charge: 100,
    setCharge:(state) => {},
});

// export const SatelliteContextProvider = (props)=> {
//     const [isObcError, setIsObcError] = useState(false);
//     const [obcStatus, setObcStatus] = useState("The OBC is Operating Normally");
//     const [isSysError, setIsSysError] = useState(false);
//     const [systemStatus, setSystemStatus] = useState("The System is Operating Normally"
//     );
//     const [charge, setCharge] = useState(100);
// }

export default SatelliteContext;