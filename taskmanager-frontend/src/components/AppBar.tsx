import React, { FC } from "react";
import { Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from "@mui/material/AppBar";

export const NavBar: FC<{
  title: string,
  appBarStyles: any,
  children: JSX.Element,
  toggleButtonCallback: React.MouseEventHandler
}> = ({ title, appBarStyles, children, toggleButtonCallback }) => {
  return (
    <>
      <AppBar {...appBarStyles}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleButtonCallback}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="div" variant="h6" color="inherit" noWrap>
            {title}
          </Typography>
          {children}
        </Toolbar>
      </AppBar>
    </>
  );
};