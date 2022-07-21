/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

import "@/bootstrap";

import ReactDOM from "react-dom";
import React from "react";
/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */
import App from "./App";
import { RecoilRoot } from "recoil";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from '@/context/app';
if (document.getElementById("root")) {
    ReactDOM.render(
        <React.StrictMode>
            <RecoilRoot>
                <BrowserRouter>
                    <AppProvider>
                        <App />
                    </AppProvider>
                </BrowserRouter>
            </RecoilRoot>
        </React.StrictMode>,
        document.getElementById("root")
    );
}
