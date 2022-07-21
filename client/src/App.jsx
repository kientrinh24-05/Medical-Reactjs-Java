
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import React, { Suspense } from "react";
import LoginPage from "./pages/login";
import DashBoard from "./layout";
import routes from "./routes";
import { Spin } from "antd";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
library.add(fab, fas, far);

import '@/assets/css/app.scss'

const App = () => {
    const renderRoute = (item) => {
        const { path, component: Comp, childs } = item;
        return (
            <React.Fragment key={path}>
                {childs &&
                    childs.map((child) =>
                        renderRoute({
                            ...child,
                            path: path + "/" + child.path,
                        })
                    )}
                {path && <Route path={path} element={<Comp />} />}
            </React.Fragment>
        );
    };

    return (
        <Suspense
            fallback={
                <div className="fixed w-screen h-screen">
                    <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                        <Spin size="large" />
                    </div>
                </div>
            }
        >
            {/* <MenuProvider> */}
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/"
                    element={
                        <DashBoard>
                            <Outlet />
                        </DashBoard>
                    }
                >
                    {routes.map((route) => renderRoute(route))}
                    <Route index />
                </Route>
            </Routes>
            {/* </MenuProvider> */}
        </Suspense>
    );
};

export default App;
