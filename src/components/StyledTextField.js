
import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    height: 40, // Adjust height
    fontSize: "14px", // Optional: Reduce font size
    "& .MuiInputBase-input": {
      padding: "10px", // Adjust padding inside the field
    },
  },
});

export default StyledTextField;
