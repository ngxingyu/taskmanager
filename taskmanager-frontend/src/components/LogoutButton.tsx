import { Button } from '@mui/material';
import { logOut } from 'actions/userActionCreators';
import { useDispatch } from 'react-redux';

function LogoutButton() {
    const dispatch = useDispatch();

    const logout = () => {
        dispatch(logOut());
    };
    return (
        <div>
            <Button type="button" fullWidth variant="contained" color="primary"
                onClick={logout}
            >
                Logout
            </Button>

        </div>
    )
}

export default LogoutButton
