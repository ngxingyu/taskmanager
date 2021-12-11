import {Navigate} from "react-router-dom";
import {connect} from "react-redux";
import {useSelector} from 'react-redux';
import { StateProps } from "app/store";


const ProtectedRoute = (props: { children: JSX.Element, loggedIn: boolean }) => {
    // const loggedIn = useSelector<StateProps>(state => state.user_state?.authenticated);
    return props.loggedIn ? props.children : <Navigate to="/login"/>;
}


const mapStateToProps = (state: StateProps) => {
    return {
        loggedIn: state.user_state?.authenticated,
        user: state.user_state
    };
};

export default connect(mapStateToProps)(ProtectedRoute);