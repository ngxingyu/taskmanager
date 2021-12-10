import React, {Fragment} from 'react';
import {render} from "react-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import {store} from './app/store'
import {Provider} from 'react-redux'
import {Route, Routes, BrowserRouter} from 'react-router-dom'
import Login from './components/Login';
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from './components/SignUp';
import Projects from "./components/Projects/Projects";

render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Fragment>
                    <Routes>
                        {/* <Route path="/" element={<App/>}/> */}
                        <Route index element={<ProtectedRoute><Projects/></ProtectedRoute>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/signup" element={<SignUp/>}/>
                        <Route path="/projects" element={
                            <ProtectedRoute><Projects/></ProtectedRoute>
                        }/>
                    </Routes>
                </Fragment>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
    ,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
