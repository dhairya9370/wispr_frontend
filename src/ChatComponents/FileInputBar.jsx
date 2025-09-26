import { Button, Modal, Box, Typography, TextField, TextareaAutosize, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Fab, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import EmojiBtn from './EmojiBtn';
import SendIcon from '@mui/icons-material/Send';
import AttachFileBtn from "./AttatchFileBtn";
import AddIcon from '@mui/icons-material/Add';
import sendBtnHandler from "../utils/SendBtnHandler";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CalendarViewMonthOutlinedIcon from '@mui/icons-material/CalendarViewMonthOutlined';
import VisuallyHiddenInput from "../VisuallyHiddenInput";
// Utility to return JSX icon based on file type
import ClearIcon from '@mui/icons-material/Clear';
import { v4 as uuidv4 } from 'uuid';
import getFileIcon from "./getFileIcon";
import { useNavigate } from "react-router-dom";

export default function FileInputBar(
  {
    open, setOpen,
    setSelectedFiles,
    selectedFiles,
    activeChat,
    msgList,
    chatList,
    setChatList,
    chatId,
    userId,
    setMsgList,
    msgsContainnerRef,
    activePreview,
    setActivePreview,
  }
) {
  const [msgValue, setMsgValue] = useState("");
  const selectedFilesRef = useRef(selectedFiles);
  const [confirmCloseDialog, setConfirmCloseDialog] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const emojiPopoverRef = useRef();
  const scrollRef = useRef();
  const dialogRef = useRef();
  const inputRef = useRef();
  const msgListRef = useRef(msgList);
  const navigateTo = useNavigate();
  const theme=useTheme();
  useEffect(() => {
    if (selectedFiles && selectedFiles.length > 0) {
      selectedFilesRef.current = selectedFiles;
    }
  }, [selectedFiles]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open
        && dialogRef.current
        && !dialogRef.current.contains(event.target)
        && (!emojiPopoverRef.current || !emojiPopoverRef.current.contains(event.target))
      ) {
        setConfirmCloseDialog(true);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleClose = () => {
    setOpen(false);
  };
  //fix the msgValue changing, 
  // dont change selectedMsgList on each char type,
  // set the value on preview change or send file
  const onChangeHandler = (val) => {
    setMsgValue(val);
    // setActivePreview((prev) => ({
    //   ...prev,
    //   caption: e.target.value
    // }));
  };
  const onPreviewChangeHandler = (obj) => {
    const uuid = activePreview.uuid;

    setSelectedFiles((curr) =>
      curr.map((file) =>
        file.uuid === uuid ? { ...file, caption: msgValue } : file
      )
    );
    setMsgValue(obj.caption);
    setActivePreview(obj);
    inputRef.current?.focus();
  }

  const CallSendBtnHandler = () => {
    // setSelectedFiles([]);
    const uuid = activePreview.uuid;
    setSelectedFiles((curr) => {
      const updated = curr.map((file) =>
        file.uuid === uuid ? { ...file, caption: msgValue } : file
      );
      selectedFilesRef.current = updated;
      return updated;
    });

    for (const file of selectedFilesRef.current) {
      sendBtnHandler({
        file: file,
        msgValue: file.caption,
        setMsgValue,
        setChatList,
        activeChat,
        userId,
        msgList,
        setMsgList,
        msgsContainnerRef,
        msgListRef,
        chatList,
        chatId,
        navigateTo
      });
    }
    setOpen(false);
  }
  const addSelectedFiles = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).map(file => ({
        file,
        caption: "",
        name: file.name,
        uuid: uuidv4(),
        url: URL.createObjectURL(file),
        type: file.type
      }));
      setSelectedFiles((curr) => { return [...curr, ...selectedFiles] });
    }
  }
  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -50, behavior: "smooth" });
  };
  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 50, behavior: "smooth" });
  };
  const removeFileHandler = () => {
    let isEmpty = false;
    setSelectedFiles((curr) => {
      const updated = curr.filter((file) => file.uuid !== activePreview.uuid);
      if (updated.length === 0) {
        isEmpty = true;
      }
      selectedFilesRef.current = updated;
      return updated;
    });
    if (isEmpty) {
      setOpen(false);
      setActivePreview({ caption: "", name: "", uuid: "", url: "", type: "" })
      return
    }
    setActivePreview(selectedFilesRef.current[0])
  };

  return (
    <>
      {open && selectedFiles &&
        (<Box ref={dialogRef}
          sx={{
            border:"1px solid grey",
            position: 'absolute',
            bottom: 10,
            left: 10,
            bgcolor:theme.palette.background.paper,
            boxShadow: '2px 4px 4px rgba(0, 0, 0, 0.2)',
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            width: { xs: "90%", sm: "80%", md: "70%" },
            maxWidth: 700,
            // margin: "0 auto",
            zIndex: 5,
            maxHeight: "90vh",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            // overflowY: "auto", // allow internal scroll if overflow
          }}
        >
          <Fab
            size="small"
            color="black"
            aria-label="add"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8, // `1` = 8px in theme spacing
              zIndex: 10
            }}
            onClick={removeFileHandler}
          >
            <ClearIcon />
          </Fab>

          <Box
            sx={{
              width: "100%",
              minHeight: 300,
              height: "35vh",
              backgroundColor: theme.palette.background.paper,
              borderBottom: "1px solid #ccc",
              boxSizing: 'border-box',
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            {
              activePreview?.type?.startsWith("image/")
                ? <Box
                  component="img"
                  src={activePreview.url}
                  alt="preview"
                  sx={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                />
                :
                activePreview?.type?.startsWith("video/") ?
                  <video
                    src={activePreview.url}
                    controls
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                  :
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", justifyContent: "center" }}>
                    {getFileIcon(activePreview?.type || "", 80)}
                    <Typography noWrap
                      sx={{
                        maxWidth: "80vw", // restricts width based on viewport
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textAlign: "center",
                      }}>{activePreview?.name}</Typography>
                  </Box>
            }
          </Box>

          <Box sx={{ mb: 1, backgroundColor: 'rgba(0,0,0,0.03)', display: "flex", flexDirection: "row", alignItems: "flex-end", justifyContent: "center" }}>
            <EmojiBtn
              open={emojiPickerOpen}
              setOpen={setEmojiPickerOpen}
              emojiPopoverRef={emojiPopoverRef}
              onSelectEmoji={(emoji) => {
                onChangeHandler(msgValue + emoji);
              }}
            />
            <Box sx={{ flexGrow: 1, mx: 1, my:0.5 }}>
              <TextareaAutosize
                ref={inputRef}
                maxRows={6}
                minRows={1}
                aria-label="maximum height"
                onChange={(e) => onChangeHandler(e.target.value)}
                name='msgInput'
                placeholder='Caption (optional)'
                value={msgValue}
                // required={true}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                  }
                  if (e.key === "Enter" && e.shiftKey) {
                    return;
                  }
                  if (e.key === "Enter" && msgValue.trim()) {
                    e.preventDefault();
                    CallSendBtnHandler()
                  }
                }}
                style={{
                  fontFamily: "inherit",
                  resize: 'none',
                  outline: 'none',
                  width: "100%",
                  backgroundColor: 'rgba(0,0,0,0)',
                  fontSize: "1.5rem",
                  border: "none",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  display: "block",
                  color:theme.palette.text.primary,
                }}
              />
            </Box >
          </Box>
          <Box sx={{ backgroundColor: 'rgba(0,0,0,0)', display: "flex", justifyContent: "space-between", alignItems: "center", height: 50, width: "100%" }}>
            <IconButton component="label"
              // onClick={handleClick}
              disableRipple
              sx={{
                p: "2px",
                ml: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.03)',
                },
                '& .MuiIconButton-root': {
                  backgroundColor: 'transparent !important',
                },
                display: "flex",
                maxHeight: "50px",
                borderRadius: 1,
                border: "solid grey 1px"
              }}
            >
              <AddIcon sx={{ fontSize: "1em", m: 0 }}></AddIcon>
              <VisuallyHiddenInput
                type="file"
                multiple
                accept=".vcf,image/*,video/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => {
                  addSelectedFiles(e)
                }}
              />
            </IconButton>
            <KeyboardArrowLeftIcon onClick={scrollLeft} sx={{ ml: 0.5, visibility: selectedFiles.length > 1 ? "visible" : "hidden" }} />
            <Box
              ref={scrollRef}
              sx={{
                visibility: selectedFiles.length > 1 ? "visible" : "hidden",
                maxHeight: "45px",
                display: "flex",
                overflowX: "auto",
                mb: 1,
                gap: 1,
                scrollBehavior: "smooth",
                '&::-webkit-scrollbar': { display: "none" },
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              {selectedFiles.map((obj) => (
                <Box
                  key={obj.uuid}
                  onClick={() => onPreviewChangeHandler(obj)}
                  sx={{
                    width: 45,
                    height: 45,
                    borderRadius: "12px",
                    border: activePreview?.uuid === obj.uuid ? "3px solid #19bc55" : "2px solid grey",
                    flexShrink: 0,
                    cursor: "pointer",
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: activePreview?.uuid === obj.uuid ? 1 : 0.6,
                    transition: "opacity 0.2s ease",
                    maxHeight: "35px",
                    maxWidth: "35px",
                  }}
                >
                  {obj.type.startsWith("image/") ? (
                    <Box
                      component="img"
                      src={obj.url}
                      alt="preview"
                      sx={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  ) :
                    obj.type.startsWith("video/") ?
                      (<video
                        src={obj.url}
                        muted
                        autoPlay
                        loop
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />)
                      //   <Box
                      //   component="img"
                      //   src={obj.videoThumbnail}
                      //   alt="preview"
                      //   sx={{
                      //     height: "100%",
                      //     width: "100%",
                      //     objectFit: "cover",
                      //     borderRadius: "10px",
                      //   }}
                      // />
                      :
                      (
                        getFileIcon(obj.type, 25)
                      )}
                </Box>
              ))}

            </Box>
            <KeyboardArrowRightIcon onClick={scrollRight} sx={{ mr: 0.5, visibility: selectedFiles.length > 1 ? "visible" : "hidden" }} />

            <Box sx={{
              display: "flex", maxHeight: "50px",
              maxWidth: "20", mr: 0.5, mb: 0.5
            }}>
              <SendIcon
                sx={{
                  width: 35,
                  height: 35,
                  maxHeight: "25",
                  maxWidth: "25",
                  borderRadius: 1,
                  p: 0.8,
                  color: 'rgb(54, 199, 41)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  }
                }}
                onClick={CallSendBtnHandler}
              />
            </Box>
          </Box>
          <Dialog
            open={confirmCloseDialog}
            slotProps={{
              paper: {
                sx: {
                  borderRadius: 2,
                }
              }
            }}
            onClose={() => setConfirmCloseDialog(false)}
          >
            <DialogTitle>Discard selected files?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to close this file preview?<br /> All selected files will be discarded.
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ mb: 1, mr: 1 }}>
              <Button variant="contained" sx={{ bgcolor: "#19bc55" }} onClick={() => setConfirmCloseDialog(false)}>
                Keep
              </Button>
              <Button color="error" onClick={() => {
                setConfirmCloseDialog(false);
                setSelectedFiles([]);
                setActivePreview({ caption: "", name: "", uuid: "", url: "", type: "" });
                setOpen(false);
                handleClose();
              }} autoFocus>Discard</Button>
            </DialogActions>
          </Dialog>
        </Box>
        )
      }
    </>);
}
