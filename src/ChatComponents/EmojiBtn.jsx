import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import IconButton from '@mui/material/IconButton';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import Popover from '@mui/material/Popover';
import { useTheme } from '@emotion/react';

export default function EmojiBtn({ onSelectEmoji, open, setOpen, emojiPopoverRef }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };
  const theme = useTheme();
  return (
    <>
      <IconButton
        onClick={handleOpen}
        disableRipple

        sx={{
          color: theme.palette.text.primary, // <-- sets icon color
          borderRadius:1,
          mx:0.5,
          background:open? theme.palette.action.selected:"none",
          '&:hover': {
            background:theme.palette.action.hover,
          },
          display: 'flex',
        }}
      >
        <EmojiEmotionsIcon
          sx={{
            width: '20px',
            height: '20px',
            // borderRadius: 1,
            // p: 1.5,
            background:'transparent',

            // color: theme.palette.text.primary, // <-- sets icon color
            '&:hover': {
              backgroundColor: "none",
            },
          }}
        />

      </IconButton>

      <Popover
        ref={emojiPopoverRef}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <EmojiPicker
          onEmojiClick={(emojiData) => {
            onSelectEmoji(emojiData.emoji);
            handleClose();
          }}
          theme={theme.palette.mode === "dark" ? "dark" : "light"}
        />
      </Popover>
    </>
  );
}
