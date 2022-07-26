import { Form, Input, Button, Checkbox, Card, message, Space } from "antd";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import logo from "@/assets/images/logo-login.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUserActions } from "@/_actions";
const LoginPage = () => {
    const userActions = useUserActions();
    const navigate = useNavigate();
    useEffect(() => {
        if (!!localStorage.getItem("access_token")) {
            navigate("/");
        } else {
            // axios.get("/sanctum/csrf-cookie");
        }
    }, []);
    const onFinish = async (values) => {
        try {
            await userActions.login(values);
        } catch ({response}) {
            const { data } = response;
            message.error(data.message);
        }
    };

    return (
        <div>
            <div
                className="bg-[url('@/assets/images/bg_3.jpg')]
                bg-slate-500
                opacity-60 fixed top-0 left-0 w-full h-full z-1"
            ></div>
            <div
                className={
                    "container px-4 max-w-7xl z-10 flex h-3/4  fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                }
            >
                <div className="flex-1 hidden md:block  px-16 pt-10 rounded-l-xl">
                    <img className="block mx-auto" src={logo} alt="logo" />
                </div>
                <div className="flex-1 px-16  rounded-r-xl relative">
                    <div className="w-1/2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <h1 className="text-2xl font-bold text-white ">
                            Welcome to Medical App
                        </h1>
                        <h2 className=" text-md font-semibold text-white">
                            Sign in by entering information below
                        </h2>
                        <Form
                            className="mt-4 login-form"
                            layout="vertical"
                            initialValues={{
                                remember: true,
                                username: "admin@gmail.com",
                                password: "123456",
                            }}
                            onFinish={async (values) => await onFinish(values)}
                        >
                            <Form.Item
                                label="Username"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter required field",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                type="password"
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter required field",
                                    },
                                ]}
                            >
                                <Input
                                    type={"password"}
                                />
                            </Form.Item>

                            <Form.Item name="rememberClient" valuePropName="checked">
                                <Checkbox>
                                    <span className="text-gray-100 text-md font-bold">
                                        Remember my preference
                                    </span>
                                </Checkbox>
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    className="bg-gray-100 h-14 w-11/12 mx-auto rounded-md block
                            text-blue-500 font-bold text-xl hover:bg-gray-100 hover:text-blue-500
                        "
                                    htmlType="submit"
                                >
                                    Sign in
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default LoginPage;
