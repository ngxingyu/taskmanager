import React from 'react'
import { Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { StateProps } from 'store'

const ProtectedRoute = (props: { children: JSX.Element; loggedIn: boolean }) => {
  return props.loggedIn ? <Navigate to="/projects" /> : props.children
}

const mapStateToProps = (state: StateProps) => {
  return {
    loggedIn: state.user_state?.authenticated,
  }
}

export default connect(mapStateToProps)(ProtectedRoute)
