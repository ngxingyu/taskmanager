import React, { FC, useCallback } from "react";
import { Button } from "@mui/material";
import { logOut } from "store/user/thunks";
import { useDispatch } from "react-redux";

const LogoutButton: FC = () => {
  const dispatch = useDispatch();

  const logout = useCallback(() => {
    dispatch(logOut());
  }, []);
  return (
    <Button type="button" fullWidth variant="contained" color="primary" onClick={logout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
