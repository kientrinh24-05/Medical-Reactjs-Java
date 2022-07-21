import {
    Form,
    Input,
    PageHeader,
    Card,
    Col,
    Row,
    Button,
    Space,
    message,
    Spin,
    Avatar,
    Select,
    DatePicker,
} from "antd";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useUserActions } from "@/_actions";
import { useParams } from "react-router-dom";
import UploadFile from "@/components/upload";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import { accountAtom } from "@/_state";
import { useRecoilValue } from "recoil";

const Profile = ({}) => {
    const userAction = useUserActions();
    const profile = useRecoilValue(accountAtom);
    const navigate = useNavigate();
    const [form] = Form.useForm();
 

    const [saveLoading, setSaveLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [model, setModel] = useState({
        avatar: profile.avatar,
    });
    form.setFieldsValue(profile);


    useEffect(() => {
        setModel({
            avatar: profile.avatar,
        });
    }, [profile]);
    
    const onSave = async () => {
        try {
            const values = await form.validateFields();
            setSaveLoading(true);
            await userAction.update(profile.id, {
                ...values,
                ...model,
            });
            setSaveLoading(false);
            message.success("Cập nhật thông tin thành công");
        } catch (error) {
            setSaveLoading(false);
            console.log(error);
            message.error(error.response.data.message);
        }
    };
    return (
        <div>
            <PageHeader
                title={"Thông tin tài khoản"}
                onBack={() => navigate("/")}
            />

            <Form
                form={form}
                labelCol={{
                    span: 6,
                }}
                name="form"
                onFinish={onSave}
            >
                <Row gutter={15}>
                    <Col span={18}>
                        <Card title="Thông tin">
                            {loading ? (
                                <Spin />
                            ) : (
                                <>
                                    <Form.Item
                                        name="username"
                                        label="Username"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng nhập username",
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        name="name"
                                        label="Họ tên"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng nhập họ và tên",
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        name="email"
                                        label="Email"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng nhập email",
                                            },
                                            {
                                                type: "email",
                                                message: "Email không hợp lệ",
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        name="phone"
                                        label="Số điện thoại"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng nhập số điện thoại",
                                            },
                                            {
                                                pattern:
                                                    /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
                                                message:
                                                    "Số điện thoại không hợp lệ",
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="gender" label="Giới tính">
                                        <Select
                                            options={[
                                                { label: "Nam", value: 1 },
                                                { label: "Nữ", value: 2 },
                                                {
                                                    label: "Chưa biết",
                                                    value: 3,
                                                },
                                            ]}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Ngày sinh"
                                        name="birthdate"
                                    >
                                        <DatePicker
                                            className="w-full"
                                            placeholder="Chọn ngày"
                                        />
                                    </Form.Item>
                                    <Form.Item name="education" label="Học vấn">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        name="hire"
                                        label="Ngày bắt đầu/kết thúc HĐ"
                                    >
                                        <DatePicker.RangePicker
                                            className="w-full"
                                            allowEmpty={[true, true]}
                                        />
                                    </Form.Item>
                                    <Row>
                                        <Col span={18} push={6}>
                                            <UploadFile
                                                multiple={false}
                                                showUploadList={false}
                                                showPercent
                                                onUploadSuccess={(file) => {
                                                    console.log(file);
                                                    setModel({
                                                        ...model,
                                                        avatar: file.url,
                                                    });
                                                }}
                                            >
                                                <Avatar
                                                    className="cursor-pointer"
                                                    src={model.avatar}
                                                    shape="square"
                                                    size={150}
                                                    icon={<UserOutlined />}
                                                />
                                            </UploadFile>
                                        </Col>
                                    </Row>
                                </>
                            )}
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="Hành động">
                            {saveLoading ? (
                                <Spin />
                            ) : (
                                <Space>
                                    <Button
                                        htmlType={"submit"}
                                        disabled={loading}
                                        type="primary"
                                        className="bg-slate-600 text-white"
                                        onClick={() => onSave()}
                                    >
                                        Lưu lại
                                    </Button>
                                    <Button
                                        type="default"
                                        className="bg-red-500 text-white"
                                        onClick={() => navigate("/user")}
                                    >
                                        Huỷ bỏ
                                    </Button>
                                </Space>
                            )}
                        </Card>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};
export default Profile;
