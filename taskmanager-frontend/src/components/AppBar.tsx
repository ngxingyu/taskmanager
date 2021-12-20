import React, { FC } from "react";
import { Toolbar, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";

export const NavBar: FC<{ title: string, appBarStyles: any, children: JSX.Element }> = ({ title, appBarStyles, children }) => {
  return (
    <>
      <AppBar {...appBarStyles}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography component="div" variant="h6" color="inherit" noWrap>
            {title}
          </Typography>
          {children}
        </Toolbar>
      </AppBar>
    </>
  );
};