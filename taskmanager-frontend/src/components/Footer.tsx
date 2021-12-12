import React, { FC } from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";


const Footer:FC<any> = (props) => {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://"/>
            {' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default Footer;
