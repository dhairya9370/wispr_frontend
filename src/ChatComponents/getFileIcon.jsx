import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CalendarViewMonthOutlinedIcon from '@mui/icons-material/CalendarViewMonthOutlined';


export default function getFileIcon(fileType, fontSize){
    if (fileType.includes('pdf')) return <PictureAsPdfIcon sx={{ fontSize: fontSize, color: '#d32f2f', }}></PictureAsPdfIcon>;
    if (fileType.includes('word') || fileType.includes('doc')) return <DescriptionIcon sx={{ fontSize: fontSize, color: '#1976d2' }} />;
    if (fileType.includes("excel")) return <CalendarViewMonthOutlinedIcon color="success" />;
    return <InsertDriveFileIcon sx={{ fontSize: fontSize, color: 'gray' }} />;
  };