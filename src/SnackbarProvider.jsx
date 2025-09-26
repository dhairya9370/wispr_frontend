import React, { createContext, useContext, useState, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";

const SnackbarContext = createContext();
export function useSnackbar(){return useContext(SnackbarContext);};

export default function SnackbarProvider({ children }) {
  const [snackbar, setSnackbar] = useState({ open: false, type: "", message: "" });

  const showSnackbar = useCallback((type, message, duration = 3000) => {
    setSnackbar({ open: true, type, message });
    setTimeout(() => setSnackbar({ open: false, type: "", message: "" }), duration);
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={7000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        // sx={{display:"flex",alignContent:"center"}}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.type}
          variant="filled"
          sx={{ width: "100%",fontSize:18,alignItems:"center",alignSelf:"center" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}
