import { Box, List } from "@mui/material";
import CallBox from "./CallBox";

export default function CallBoxList({userId,callId,userList}){
    return(
        <List
            sx={{
                overflowY: 'visible',
                p: 0.5,
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
            }}>
            <Box>
                {userList
                    .filter(user => user._id.toString() !== userId.toString())
                    .map(user => (
                        <CallBox
                            key={user._id}
                            receiver={user}
                            userId={userId}
                        />
                    ))
                }
            </Box>
        </List>
    )
}