import React, { useState } from "react";
import {
    LogoutOutlined,
    SettingOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Avatar, Menu, Spin } from "antd";
import { Dropdown } from "antd";
import classNames from "classnames";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { accountAtom } from "@/_state";
import { useRecoilValue } from "recoil";
import { useUserActions } from "@/_actions";
import ResetPass from "@/pages/user/reset-pass";

const AvatarDropdown = ({ menu }) => {
    const actions = useUserActions();
    const account = useRecoilValue(accountAtom);
    const [showResetPass, setShowResetPass] = useState(false);
    const navigate = useNavigate();
    const logout = () => {
        actions.logout();
        navigate("/login");
    };
    const menuHeaderDropdown = (
        <Menu className="w-40 left-0">
            <Menu.Item>
                <a onClick={() => navigate("/profile")}>
                    <FontAwesomeIcon icon="fa-solid fa-user" /> Tài
                    khoản
                </a>
            </Menu.Item>
            <Menu.Item>
                <a onClick={() => setShowResetPass(true)}>
                    <FontAwesomeIcon icon="fa-solid  fa-key" /> Đổi mật khẩu
                </a>
            </Menu.Item>
            <Menu.Item onClick={logout}>
                <a>
                    <FontAwesomeIcon icon="fa-solid fa-arrow-right-from-bracket" />{" "}
                    Thoát
                </a>
            </Menu.Item>
        </Menu>
    );

    return (
        <div className="relative">
            <Dropdown overlay={menuHeaderDropdown}>
                <div className="flex items-center gap-2">
                    <Avatar
                        size={50}
                        src={account.avatar}
                        icon={<UserOutlined />}
                        alt="avatar"
                    />
                    <div className="flex flex-col">
                        <p
                            className={`ml-1 mr-2 font-semibold font-sans text-base text-white`}
                        >
                            {account.name}
                            <br />
                            <small>{account.email}</small>
                        </p>
                    </div>
                </div>
            </Dropdown>
            <ResetPass
                show={showResetPass}
                onRequestClose={() => setShowResetPass(false)}
                model={account}
            />
        </div>
    );
};

export default AvatarDropdown;
