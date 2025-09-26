import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CropOriginalOutlinedIcon from '@mui/icons-material/CropOriginalOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import GestureOutlinedIcon from '@mui/icons-material/GestureOutlined';
import { styled, useTheme } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import VisuallyHiddenInput from '../VisuallyHiddenInput';
import { v4 as uuidv4 } from 'uuid';


export default function AttachFileBtn({ activePreview, setActivePreview, setSelectedFiles, openFileInputBar, setOpenFileInputBar }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  // const open = Boolean(anchorEl);
  const theme = useTheme();
  const [open, setOpen] = React.useState(Boolean(anchorEl))
  const handleClick = (event) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };
  const onFileChangeHandler = async(e) => {
    if (e.target.files) {
      // const selectedFiles = Array.from(e.target.files).map(file => ({
      //   file,
      //   caption:"",
      //   name:file.name,
      //   uuid: uuidv4(),
      //   url: URL.createObjectURL(file),
      //   type: file.type
      // }));
      const files = Array.from(e.target.files);
      const selectedFiles = [];

      for (const file of files) {
        const fileObj = {
          file,
          caption: "",
          name: file.name,
          uuid: uuidv4(),
          url: URL.createObjectURL(file),
          type: file.type,
        };

        // if (file.type.startsWith("video/")) {
        //   fileObj.videoThumbnail = await getThumbnailURL(file);
        //   console.log(fileObj.videoThumbnail);
          
        // }
        selectedFiles.push(fileObj);
      }

      setOpenFileInputBar(true);
      setSelectedFiles(selectedFiles);
      setActivePreview(selectedFiles[0])
      handleClose();
    }
  }
  const handleImageCapture=()=>{

  }
  return (
    <>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}
      >
        <MenuItem component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
        // onClick={() => { setOpenFileInputBar(true) }}
        >
          <CropOriginalOutlinedIcon sx={{ mr: 1 }} />
          Photos & Videos
          <VisuallyHiddenInput
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={(e) => {
              onFileChangeHandler(e)
            }}
          />
        </MenuItem>
        <MenuItem component="label">
        <CameraAltOutlinedIcon sx={{ mr: 1 }} />
        Camera
        <VisuallyHiddenInput
            type="file"
            multiple
            capture="environment"
            accept="image/*"
            onChange={(e) => {
              onFileChangeHandler(e)
            }}
          />
        </MenuItem>
        <MenuItem component="label">
          <InsertDriveFileOutlinedIcon sx={{ mr: 1 }} />
          Document
          <VisuallyHiddenInput
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => {
              onFileChangeHandler(e)
            }}
          />
        </MenuItem>
        <MenuItem component="label">
          <PersonOutlineOutlinedIcon sx={{ mr: 1 }} />
          Contact File
          <VisuallyHiddenInput
            type="file"
            accept=".vcf"
            onChange={(e) => onFileChangeHandler(e)}
          />
        </MenuItem>


        <MenuItem onClick={handleClose}><GestureOutlinedIcon sx={{ mr: 1 }} />Drawing</MenuItem>
      </Menu>
      <IconButton
        onClick={handleClick}
        disableRipple
        sx={{
          // mt: 1,
          mr: -1,
          color: theme.palette.text.primary, // <-- sets icon color
          borderRadius: 1,

          '&:hover': {
            backgroundColor:theme.palette.action.hover,
          },
          '& .MuiIconButton-root': {
            backgroundColor: 'transparent !important',
          },
          background:open?theme.palette.action.selected:"none",
          display: "flex"
        }}
      >
        <AttachFileIcon sx={{
          width: "20px",
          height: "20px",
          // borderRadius: 1,
          // p: 1.5,
          color: theme.palette.text.primary, // <-- sets icon color
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor:"none",
          },
          background: "transparent",
        }} />
      </IconButton>
    </>
  );
}
