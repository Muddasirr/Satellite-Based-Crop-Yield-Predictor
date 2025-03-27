import { TextField } from "@mui/material";

const StyledTextField = (props) => {
  return (
    <TextField
      {...props}
      sx={{
        width: '100%',
        marginBottom: '16px', // Add space between fields
        '& .MuiOutlinedInput-root': {
          borderRadius: '10px',
          padding: '6px 10px', // Reduce padding for compactness
        },
        '& .MuiInputLabel-root': {
          color: '#427662',
          fontSize: '0.875rem', // Slightly smaller label text for compact design
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#e4e7e6',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#427662',
        },
        '& .MuiInputBase-input': {
          padding: '8px 10px', // Reduce padding inside the input
          fontSize: '0.875rem', // Slightly smaller text size for compactness
        },
      }}
    />
  );
};

export default StyledTextField;