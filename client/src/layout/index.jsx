import { Avatar, Layout, Menu } from "antd";
const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
import routes from "../routes";
import { Link } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import AppContext from "@/context/app";
import { useMatch } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import logoMini from "@/assets/images/logo-mini.png";
import Header from "./header";
import { useAccountActions, useRoleActions } from "@/_actions";
import { useNavigate } from "react-router";
import JobRequest from "./job";
import { useSetRecoilState } from "recoil";
import { jobAtom } from "@/_state/job";

const DashBoard = ({ children }) => {
    const navigate = useNavigate();

    const accountActions = useAccountActions();
    const roleActions = useRoleActions();

    const appContext = useContext(AppContext);
    const cancelTokenSource = axios.CancelToken.source();

    useEffect(() => {
        if (!localStorage.getItem("access_token")) {
            navigate("/login");
            return;
        }
        accountActions.getProfile();
        roleActions.getPermission();

        return () => {
            cancelTokenSource.cancel();
        };
    }, []);

    let selectedKey = null;
    let openKey = null;
    routes
        .filter((x) => !x.hidden)
        .map((x, index) => {
            if (!x.childs) {
                const path = useMatch({
                    path: x.path,
                    end: true,
                });
                if (!!path) {
                    selectedKey = "" + index;
                    openKey = null;
                }
            } else {
                x.childs
                    .filter((x) => !x.hidden)
                    .map((c, cIndex) => {
                        const path = useMatch({
                            path: x.path + "/" + c.path,
                            end: true,
                        });
                        if (!!path) {
                            openKey = "" + index;
                            selectedKey = index + "-" + cIndex;
                        }
                    });
            }
        });

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                width={250}
                style={{
                    overflow: "auto",
                    height: "100vh",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                }}
                theme="light"
                collapsed={appContext.collapsed}
            >
                <div className=" bg-slate-700 h-16 flex items-center text-center">
                    {/* <img
                        className="inline-block mx-auto"
                        src={appContext.collapsed ? logoMini : logo}
                    /> */}
                </div>
                <Menu
                    theme="light"
                    defaultSelectedKeys={[selectedKey]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                >
                    {routes
                        .filter((x) => !x.hidden)
                        .map((r, index) => {
                            const childs = r.childs?.filter((x) => !x.hidden);
                            if (childs) {
                                return (
                                    <SubMenu
                                        key={index}
                                        icon={r.icon}
                                        title={r.title}
                                    >
                                        {childs.map((c, cIndex) => (
                                            <Menu.Item
                                                key={index + "-" + cIndex}
                                            >
                                                <Link
                                                    to={
                                                        r.path
                                                            ? r.path +
                                                              "/" +
                                                              c.path
                                                            : c.path
                                                    }
                                                >
                                                    {c.title}
                                                </Link>
                                            </Menu.Item>
                                        ))}
                                    </SubMenu>
                                );
                            } else {
                                return (
                                    <Menu.Item
                                        key={index}
                                        title={r.title}
                                        icon={r.icon}
                                    >
                                        <Link to={r.path}>{r.title}</Link>
                                    </Menu.Item>
                                );
                            }
                        })}
                </Menu>
            </Sider>
            <Layout
                className="site-layout"
                style={{
                    marginLeft: appContext.collapsed ? 80 : 250,
                    transition: "all 0.15s",
                }}
            >
                <Header />
                <Content style={{ margin: "0 16px" }}>{children}</Content>
                <Footer style={{ textAlign: "center" }}>
                    Jira 2022 Created by Vietez
                </Footer>
                {/* <JobRequest /> */}
            </Layout>
        </Layout>
    );
};
export default DashBoard;
