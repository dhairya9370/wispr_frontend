export default function formatTime(date){
    let newDate=new Date(date);
    newDate=newDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                });
    return newDate.toString();
}