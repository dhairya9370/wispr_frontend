import { Box, Button, Typography, useTheme } from "@mui/material";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { useState } from "react";
import AddGroupMembersDialog from "./ChatComponents/AddGroupMembersDialog";
export default function Heading({type,userId,chatList}) {
  const [groupAddOpen, setGroupAddOpen] = useState(false);
  const theme=useTheme();
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: theme.palette.text.paper,
        pt: 2, pb: 2,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "100",
          fontSize: 30,
          color: theme.palette.background.primary,
          ml: 2
        }}
      >
        {type}
      </Typography>
      {type==="Chats" ?
      <>
      <Button
        onClick={() => {groupAddOpen? setGroupAddOpen(false): setGroupAddOpen(true)}} //handle this new group creation 
        sx={{
          width: 40,
          height: 40,
          minWidth: 40,
          justifySelf: "flex-end",
          alignSelf: "flex-end",
          mr: 1,
          "&:hover":{
            bgcolor:theme.palette.action.hover,
          }
        }}
        title="New Group"
      >
        <GroupAddIcon  sx={{ fontSize: 20, color: "rgb(71, 229, 71)" }} />
      </Button>
      <AddGroupMembersDialog  chatList={chatList} userId={userId} open={groupAddOpen} setOpen={setGroupAddOpen} />
      </>:
      <>
      </>
      }
      
    </Box>
  );
}
