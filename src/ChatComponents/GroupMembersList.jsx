import { IconButton, List, ListSubheader, Typography } from '@mui/material';
import OverviewChatBox from './OverviewChatBox.jsx';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
export default function GroupMembersList({isViewerAdmin,memberList,userId}){
    // console.log(memberList);
    
    return (
        <List sx={{width:"95%"}}>
            {isViewerAdmin && 
            <ListSubheader sx={{display:"flex",justifyContent:"flex-start",alignItems:"center",gap:2}}>
                <IconButton sx={{width: 50, height: 50,p:1,bgcolor:"#19bc55",color:"white","&:hover":{color:"#19bc55",bgcolor:"white",border:"1px solid grey"}}}>
                <PersonAddAltIcon sx={{ width: 25, height: 25,}}></PersonAddAltIcon>
                </IconButton>
                <Typography>
                    Add Members 
                </Typography>
            </ListSubheader>}
            {memberList.map((m)=>
                <OverviewChatBox key={m._id} userId={userId} receiver={m}/>
            )}
        </List>
    );
}
