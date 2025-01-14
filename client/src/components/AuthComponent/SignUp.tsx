import React from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { EyeOff, Eye } from "lucide-react";
import useAuthComponent from "./useAuthComponent";

const SignUp: React.FC = () => {
  const {
    authState,
    setAuthState,
    handleClickShowPassword,
    handleMouseDownPassword,
    handleCreateUser,
    isRegisterLoading,
  } = useAuthComponent();
  return (
    <Box
      component="form"
      onSubmit={handleCreateUser}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        mt={2}
      >
        Create an Account
      </Typography>

      {authState.error && (
        <Typography color="error" variant="body2">
          {authState.error}
        </Typography>
      )}

      <TextField
        fullWidth
        label="Full Name"
        type="text"
        variant="outlined"
        value={authState.fullName}
        onChange={(e) =>
          setAuthState({ ...authState, fullName: e.target.value })
        }
        required
        error={!!authState.error}
        disabled={authState.loading}
      />

      <TextField
        fullWidth
        label="Email"
        type="email"
        variant="outlined"
        value={authState.email}
        onChange={(e) => setAuthState({ ...authState, email: e.target.value })}
        required
        error={!!authState.error}
        disabled={authState.loading}
      />

      <TextField
        fullWidth
        label="Password"
        type={authState.showPassword ? "text" : "password"}
        variant="outlined"
        value={authState.password}
        onChange={(e) =>
          setAuthState({ ...authState, password: e.target.value })
        }
        required
        error={!!authState.error}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => handleClickShowPassword("showPassword")}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {authState.showPassword ? <EyeOff /> : <Eye />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        fullWidth
        label="Confirm Password"
        type={authState.showConfirmPassword ? "text" : "password"}
        variant="outlined"
        value={authState.confirmPassword}
        onChange={(e) =>
          setAuthState({ ...authState, confirmPassword: e.target.value })
        }
        required
        error={!!authState.error}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => handleClickShowPassword("showConfirmPassword")}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {authState.showConfirmPassword ? <EyeOff /> : <Eye />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        disabled={
          isRegisterLoading ||
          authState.password !== authState.confirmPassword ||
          !authState.email ||
          !authState.password ||
          !authState.fullName
        }
      >
        {isRegisterLoading ? "Loading..." : "Sign Up"}
      </Button>
    </Box>
  );
};

export default SignUp;
