import {Navigate} from "react-router-dom";
import {connect} from "react-redux";
import {StateProps} from "../reducers";
import {useSelector} from 'react-redux';

const ProtectedRoute = (props: { children: JSX.Element }) => {
    const loggedIn = useSelector<StateProps>(state => state.user_state?.authenticated);
    return loggedIn ? props.children : <Navigate to="/login"/>;

}


const mapStateToProps = (state: StateProps) => {
    return {
        loggedIn: state.user_state?.authenticated,
        user: state.user_state
    };
};

export default connect(mapStateToProps)(ProtectedRoute);