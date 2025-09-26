import { List } from "@mui/material";
import OverviewChatBoxList from "./OverviewChatBox"

export default function CommonGroupsList({ groupList, userId }) {
    return (
        <List  sx={{width:"95%"}}>
            {groupList.map((g) =>
                <OverviewChatBoxList key={g._id} userId={userId} receiver={g} />
            )}
        </List>
    );
}