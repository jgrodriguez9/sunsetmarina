import { useState } from "react";
import { Tooltip } from "reactstrap";

export default function TooltipDescription({text="", id}){
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const toggle = () => setTooltipOpen(!tooltipOpen);
    return (
        <Tooltip
            autohide
            flip
            isOpen={tooltipOpen}
            target={id}
            toggle={toggle}
        >
            {text}
      </Tooltip>        
    )
}