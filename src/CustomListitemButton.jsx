import { ListItemButton, styled } from "@mui/material";

const CustomListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "selected" && prop !== "open" && prop !== "btn",
})(({ selected, open, btn }) => ({
  position: "relative",
  minHeight: 48,
  paddingLeft: 20,
  paddingRight: 20,
  justifyContent: open ? "initial" : "center",
  backgroundColor: selected===btn?"#d9ffe429": "transparent",
  color: "background.paper",
  transition: "background-color 0.3s ease, color 0.3s ease",

  "&.Mui-selected": {
    backgroundColor: "#d9ffe4ff",
    color: "black",
  },
  "&.Mui-selected:hover": {
    backgroundColor: "#d9ffe4ff",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    left: 2,
    top: "25%",
    width: "4px",
    height: "50%",
    backgroundColor: "#19bc55",
    borderRadius: "2px",
    transformOrigin: "center",
    transform: selected === btn ? "scaleY(1)" : "scaleY(0)",
    transition: "transform 0.3s ease",
  },
}));
export default CustomListItemButton
