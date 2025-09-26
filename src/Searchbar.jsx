import { useEffect, useRef, useState } from "react";
import { Box, IconButton, InputBase, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSnackbar } from "./SnackbarProvider";
import api from "./api";
import ClearIcon from '@mui/icons-material/Clear';


export default function Searchbar({ userId, value, setValue, setSearchingList, setLoadingSearchList }) {

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current?.focus()
  }, []);
  const theme=useTheme();
  const { showSnackbar } = useSnackbar();
  const handleSearch = async (e) => {
    setValue(e.target.value);
    setSearchingList([]);
    if (e.target.value?.trim()) {
      setLoadingSearchList(true);
      try {
        const result = await api.post("/api/get-chat-list", { value: e.target.value, userId });
        setSearchingList(result.data);
        setLoadingSearchList(false);
      } catch (err) {
        // console.log(err);
        setSearchingList(null);
        setLoadingSearchList(false);
        showSnackbar("error", "Failed to fetch");
      }
    }
  }
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        justifyItems: "center",
        width: "100%",
        position: "relative",
      }}
    >
      <SearchIcon
        sx={{
          position: "absolute",
          left: "15px",
          top: "8px",
          color: theme.palette.text.primary,
        }}
      />
      <InputBase
        ref={inputRef}
        placeholder="Search by name or id"
        value={value}
        onChange={handleSearch}
        fullWidth
        sx={{
          border: "1px solid rgb(148, 148, 148)",
          borderRadius: "3px",
          fontSize: "1rem",
          height: 40,
          pl: 5,
          pr: 2,
          // mb: 2,
          ml: 1,
          mr: 1,

          "&.Mui-focused": {
            border: "none",
            outline: "none",
            borderBottom: "3px solid rgb(70,191,36)",
            borderRadius: "2px",
          },

          "& input": {
            outline: "none",
          },
        }}
      />
      {value?.trim() ?
      <IconButton
        size="small"
        onClick={() =>{ 
          setValue("");
          setSearchingList([]);
          setLoadingSearchList(false);
        }}
        sx={{
          position: "absolute",
          right: "15px",
          top: "8px",
          borderRadius: "4px",
          padding: "2px",
          backgroundColor: theme.palette.background.paper,
          "&:hover": { backgroundColor: theme.palette.action.hover },
        }}
      >
        <ClearIcon fontSize="small" 
        />
      </IconButton>
      :null
      }
    </Box>
  );
}
