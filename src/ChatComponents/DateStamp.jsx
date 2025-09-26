import { Box, ListSubheader, useTheme } from "@mui/material";

export default function DateStamp({ date }) {
    const theme=useTheme();
    return (
        <ListSubheader
            className="dateStamp"
            sx={{
                mb:0.5,
                alignSelf: "center",
                position: "sticky",
                background:"transparent",
            }}>
            <Box
                sx={{
                    px:date==="Today"?5: 2, lineHeight: 2.3, fontSize: 17, mt: 0.5,
                    height: "auto",
                    width: 'auto',
                    // color:theme.palette.text.primary,
                    alignSelf: "center",
                    backgroundColor:theme.palette.mode==="dark"?theme.palette.background.paper: "rgb(189, 209, 215)",
                    borderRadius: "8px",
                    border:`0.1px solid ${theme.palette.mode==="dark"?theme.palette.action.selected:"white"}`,
                    position: "sticky",
                    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", sans-serif'
                }}>
                {date}
            </Box>

        </ListSubheader>
    );
}