import { styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import { FC } from "react";

const CustomTooltip: FC<TooltipProps> = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "rgba(34, 34, 34, 0.8)", // Dark gray with transparency for a glassy effect
        color: "#ffffff", // White font color for contrast
        fontSize: theme.typography.pxToRem(12),
        border: "1px solid rgba(255, 255, 255, 0.2)", // Light border for subtle effect
        backdropFilter: "blur(20px)", // Increased blur for a more glassy effect
        borderRadius: "8px", // Optional: rounded corners
        padding: "8px",
    },
}));

export default CustomTooltip;
