import React from 'react';
import { Toolbar, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';

type NavBarProps = {
    title: string
    children: React.ReactNode
    appBarStyles: any
}

export const NavBar = ({ title, children, appBarStyles, ...rest }: NavBarProps) => {
    return <>
        <AppBar {...appBarStyles}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <Typography component="div" variant="h6" color="inherit" noWrap>
                    {title}
                </Typography>
                {children}
            </Toolbar>
        </AppBar>
    </>
};





// export const AppBar = styled(MuiAppBar, {
//     shouldForwardProp: (prop) => (
//         prop !== 'open' && prop !== "drawerWidth"),
// })<AppBarProps>(({ theme, open, drawerWidth }) => ({
//     zIndex: theme.zIndex.drawer + 1,
//     transition: theme.transitions.create(['width', 'margin'], {
//         easing: theme.transitions.easing.sharp,
//         duration: theme.transitions.duration.leavingScreen,
//     }),
//     ...(open && {
//         marginLeft: drawerWidth,
//         width: `calc(100% - ${drawerWidth}px)`,
//         transition: theme.transitions.create(['width', 'margin'], {
//             easing: theme.transitions.easing.sharp,
//             duration: theme.transitions.duration.enteringScreen,
//         }),
//     }),
// }));