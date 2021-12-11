import React, { Fragment } from 'react';
import { render } from "react-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import { store, history } from './app/store'
import { Provider } from 'react-redux'
import { BrowserRouter, HistoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from 'components/ProtectedRoute';
import Projects from 'components/Projects';
import Login from 'components/Login';
import SignUp from 'components/SignUp';
import AuthenticationRoute from 'components/AuthenticationRoute';

render(
    <React.StrictMode>
        <Provider store={store}>
            <React.Fragment>
                <HistoryRouter history={history}>
                    <Fragment>
                        <Routes>
                            <Route index element={<ProtectedRoute><Projects /></ProtectedRoute>} />
                            <Route path="/login" element={<AuthenticationRoute><Login /></AuthenticationRoute>} />
                            <Route path="/signup" element={<AuthenticationRoute><SignUp /></AuthenticationRoute>} />
                            <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
                        </Routes>
                    </Fragment>
                </HistoryRouter>
            </React.Fragment>
        </Provider>
    </React.StrictMode>
    ,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
