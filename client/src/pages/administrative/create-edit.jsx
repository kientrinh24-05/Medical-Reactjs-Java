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
    Select,
    Table,
    List,
    Popconfirm,
    Modal,
} from "antd";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useAdministrativeActions, useRoleActions } from "@/_actions";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import RoleModal from "./create-edit-role";
import { userCan } from "@/_state";

const CreateRole = ({ }) => {
    const actions = useAdministrativeActions();

      const [levelCountrys, setLevelCountrys] = useState([
        { name: "Tỉnh/TP", code: 0 },
        { name: "Quận/Huyện", code: 1 },
        { name: "Xã/Phường", code: 2 },
        { name: "Thôn/Xóm", code: 3 },
      ]);
    
      const [levelCountry, setLevelCountry] = useState(levelCountrys[0]?.name);
    
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { id } = useParams();
    const isEdit = !!id;

    const [saveLoading, setSaveLoading] = useState(false);
    const [loading, setLoading] = useState(false);


    const loadDetail = async () => {
        setLoading(true);
        const { data } = await actions.show(id);

        form.setFieldsValue({
            name: data.data.name,
            fullName: data.data.fullName,
            code: data.data.code,
            shortName: data.data.shortName,
            type: data.data.type,
            unsignedName: data.data.unsignedName,
            status: data.data.status,

        });
        setLoading(false);
    };

    useEffect(() => {
        if (id) {
            loadDetail();
        }
    }, []);

    const onSave = async () => {
        try {
            const values = form.getFieldsValue();
            setSaveLoading(true);
            const data = {
                id,
                ...values
            };
            if (isEdit) {
                await actions.update(data);
            } else {
                await actions.create(data);
                form.resetFields();
            }
            setSaveLoading(false);

            message.success(
                isEdit
                    ? "Cập nhật đơn vị hành chính thành công"
                    : "Thêm mới đơn vị hành chính thành công"
            );
        } catch (error) {
            console.error(error);
            // message.error(error.response.data.message);
        }
    };

    return (
        <div>
            <PageHeader
                title={isEdit ? "Cập nhật đơn vị hành chính" : "Thêm mới đơn vị hành chính"}
                onBack={() => navigate("/administrative")}
            />

            <Form
                form={form}
                onFinish={onSave}
                name="form"
                labelCol={{
                    span: 6,
                }}
            >
                <Row gutter={15}>
                    <Col span={18}>
                        <Card title="Thông tin">
                            {loading ? (
                                <Spin />
                            ) : (
                                <>

                                    <Row gutter={12}>

                                        
                                        <Col md={10}>
                                            <Form.Item
                                                name="code"
                                                label="Mã"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Vui lòng nhập tên danh mục",
                                                    },
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>

                                        </Col>
                                        <Col md={10}>
                                            <Form.Item
                                                name="name"
                                                label="Tên"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Vui lòng nhập tên danh mục",
                                                    },
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>

                                        </Col>
                                        <Col md={10}>
                                            <Form.Item
                                                name="shortName"
                                                label="Ten viết tắt"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Vui lòng nhập tên danh mục",
                                                    },
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>

                                        </Col>

                                        <Col md={10}>
                                            <Form.Item
                                                name="fullName"
                                                label="Ten đầy đủ"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Vui lòng nhập tên danh mục",
                                                    },
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>

                                        </Col>
                                        <Col md={10}>
                                            <Form.Item
                                                name="unsignedName"
                                                label="Tên không dấu"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Vui lòng nhập tên danh mục",
                                                    },
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>

                                        </Col>
                                        <Col md={10}>
                                            <Form.Item
                                                name="type"
                                                label="Cấp độ"
                                                rules={[
                                                    {
                                                        message: "Vui lòng nhập tên danh mục",
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    name="type"
                                                    showSearch
                                                    style={{ width: 200 }}
                                                    optionFilterProp="children"
                                                    onChange={(value) => setLevelCountry(value)}
                                                    filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                                >
                                                    {levelCountrys.map((item) => (
                                                        <Option key={item.code} value={item.code}>
                                                            {item.name}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>

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
                                        disabled={loading}
                                        type="primary"
                                        className="bg-slate-600 text-white"
                                        htmlType="submit"
                                    >
                                        Lưu lại
                                    </Button>
                                    <Button
                                        type="default"
                                        className="bg-red-500 text-white"
                                        onClick={() => navigate("/department")}
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
export default CreateRole;
