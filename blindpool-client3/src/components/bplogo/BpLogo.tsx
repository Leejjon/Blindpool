import React from "react";
import {styled} from "@mui/material";

const BpLogo: React.FC = () => {
    return <img alt="BLINDPOOL" src={"/icons/logosmall.png"}/>
}

const StyledBpLogo = styled(BpLogo)(({theme}) => ({
    width: "150px", height: "24px", marginTop: "20.5em"
}))

export default function StyledBpLogoFn() {
    return <StyledBpLogo />
}
