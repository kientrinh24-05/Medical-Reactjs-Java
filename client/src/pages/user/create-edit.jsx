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
import { useUserActions , useDepartmentActions } from "@/_actions";
import { useRecoilValue } from "recoil";
import { useParams } from "react-router-dom";
import UploadFile from "@/components/upload";
import { departmentAtom } from "@/_state";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import { districts } from "../../utils/district";
import { wards } from "../../utils/wards";
import { provinces } from "../../utils/provinces";

const CreateEditUser = ({}) => {
    const userActions = useUserActions();
    const actionDepartment = useDepartmentActions();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { id } = useParams();
    const isEdit = !!id;

    const [saveLoading, setSaveLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [model, setModel] = useState({
        avatar: null,
    });
    const departments = useRecoilValue(departmentAtom);
    const [department, setDepartment] = useState(departments[0]?.name);

    const [provincesFilter, setProvinceFilter] = useState(provinces);
    const [districtsFilter, setDistrictFilter] = useState(districts);
    const [wardsFilter, setWardFilter] = useState(wards);

    const [province, setProvince] = useState(null);
    const [district, setDistrict] = useState(null);
    const [ward, setWard] = useState(null);
    
  
    useEffect(() => {
        if(province) {
            setDistrictFilter(districts.filter(district => district.parent_code === province))
        }
    }, [province])

    useEffect(() => {   
        if(district) {
            setWardFilter(wards.filter(ward => ward.parent_code === district))
        }
    }, [district])





    const loadDataDepartment= async () => {
        setLoading(true);
        await actionDepartment.getList();
        setLoading(false);
    };

    const loadDetail = async () => {
        setLoading(true);
        const { data } = await userActions.show(id);

        console.log(data , 'data');
        form.setFieldsValue({

            code:data.data.code,
            name:data.data.name,
            district:data.data.district,
            province:data.data.province,
            role:data.data.roles[0].ids,
            ward:data.data.ward,
            education:data.data.education,
            address:data.data.address,
            email:data.data.email,
            gender:data.data.gender,
            level:data.data.level,
            password:data.data.password,
            phone:data.data.phone,
            type:data.data.type,
            username:data.data.username,
            departmentId:data.data.department.id,
            birthDay:moment(data.data.birthDay),

        });
        setLoading(false);
    };

    useEffect(() => {
        loadDataDepartment();
        if (id) {
            loadDetail();
        }
    }, []);

    const onSave = async () => {
        try {
            const values = await form.validateFields();
            console.log(values  ,' values');
            setSaveLoading(true);
            const data = {
                id:id*1,
                ...values,
                district:parseInt(values.district),
                province:parseInt(values.province),
                ward:parseInt(values.ward),
                birthDay:moment(values.birthDay).format("DD/MM/YYYY")
            }
            if (isEdit) {
                await userActions.update(data);
            } else {
                await userActions.create(data);
                form.resetFields();
            }
            setSaveLoading(false);

            message.success(
                isEdit
                    ? "Cập nhật người dùng thành công"
                    : "Thêm mới người dùng thành công"
            );
        } catch (error) {
            setSaveLoading(false);
            console.log(error);
            message.error(error.response.data.message);
        }
    };
    return (
        <div>
            <PageHeader
                title={isEdit ? "Cập nhật người dùng " : "Thêm mới người dùng "}
                onBack={() => navigate("/user")}
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
                                        name="code"
                                        label="Mã nhân viên"
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
                                        label="Tên nhân viên"
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
                                            name="password"
                                            label="Mật khẩu"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng nhập mật khẩu",
                                                },
                                            ]}
                                        >
                                            <Input type={"password"}/>
                                        </Form.Item>
                                    <Form.Item
                                        name="address"
                                        label="Địa chỉ"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng nhập address",
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

                                    <Form.Item name="role" label="Quyền truy cập">
                                        <Select
                                            options={[
                                                { label: "Admin", value: 1 },
                                                { label: "Customer", value: 2 },
                                                {
                                                    label: "Employe",
                                                    value: 3,
                                                },
                                            ]}
                                        />
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
                                        name="birthDay"
                                    >
                                        <DatePicker
                                            className="w-full"
                                            placeholder="Chọn ngày"
                                        />
                                    </Form.Item>

                                    <Form.Item name="level" label="Chức vụ">
                                        <Select
                                            options={[
                                                { label: "Bác sĩ chuyên khoa", value: 1 },
                                                { label: "Bảo vệ", value: 2 },
                                                {
                                                    label: "Điều dưỡng",
                                                    value: 3,
                                                },
                                                {
                                                    label: "Cử nhân sinh học",
                                                    value: 4,
                                                },
                                                {
                                                    label: "Y tá",
                                                    value: 5,
                                                },
                                                {
                                                    label: "Dược sĩ",
                                                    value: 5,
                                                },
                                                {
                                                    label: "Giám đốc",
                                                    value: 5,
                                                },
                                                {
                                                    label: "Hộ lý",
                                                    value: 6,
                                                },
                                                {
                                                    label: "Phó giám đốc",
                                                    value: 7,
                                                },
                                            ]}
                                        />
                                    </Form.Item>

                                        <Form.Item
                                            name="departmentId"
                                            label="Phòng ban"
                                            rules={[
                                                {
                                                required: true,
                                                message: "Vui lòng nhập tên danh mục",
                                                },
                                            ]}
                                            >
                                            <Select
                                                name="departmentId"
                                                defaultValue={departments[0]?.id}
                                                showSearch
                                                style={{ width: 200 }}
                                                optionFilterProp="children"
                                                onChange={(value) => setDepartment(value)}
                                                filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {departments.items.map((item) => (
                                                <Option key={item.id} value={item.id}>
                                                    {item.name}
                                                </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item name="education" label="Chức danh">
                                            <Select
                                                options={[
                                                    { label: "Bác sĩ điều trị", value: 1 },
                                                    { label: "Cử nhân điều dưỡng", value: 2 },
                                                    {
                                                        label: "Y sĩ",
                                                        value: 3,
                                                    },
                                                ]}
                                            />
                                        </Form.Item>

                                        <Form.Item name="type" label="Loại nhân lực">
                                            <Select
                                                options={[
                                                    { label: "Biên chế", value: 1 },
                                                    { label: "Hợp đồng", value: 2 },
                                                    {
                                                        label: "Nhân lực thôn bản",
                                                        value: 3,
                                                    },
                                                ]}
                                            />
                                        </Form.Item>


                                        <Form.Item
                                            name="province"
                                            label="Tỉnh/TP"
                                            rules={[
                                                {
                                                required: true,
                                                message: "Vui lòng nhập tên danh mục",
                                                },
                                            ]}
                                            >
                                            <Select
                                                name="province"
                                                defaultValue={null}
                                                showSearch
                                                style={{ width: 200 }}
                                                optionFilterProp="children"
                                                onChange={(value) => {
                                                    setProvince(value)
                                                }}
                                                filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {provincesFilter.map((item) => (
                                                <Option key={item.code} value={item.code}>
                                                    {item.name_with_type}
                                                </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            name="district"
                                            label="Quận/Huyện"
                                            rules={[
                                                {
                                                required: true,
                                                message: "Vui lòng nhập tên danh mục",
                                                },
                                            ]}
                                            >
                                            <Select
                                                name="district"
                                                defaultValue={null}
                                                showSearch
                                                style={{ width: 200 }}
                                                optionFilterProp="children"
                                                onChange={(value) => setDistrict(value)}
                                                filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {districtsFilter.map((item) => (
                                                <Option key={item.code} value={item.code}>
                                                    {item.name_with_type}
                                                </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            name="ward"
                                            label="Xã/Phường"
                                            rules={[
                                                {
                                                required: true,
                                                message: "Vui lòng nhập tên danh mục",
                                                },
                                            ]}
                                            >
                                            <Select
                                                name="ward"
                                                defaultValue={null}
                                                showSearch
                                                style={{ width: 200 }}
                                                optionFilterProp="children"
                                                onChange={(value) => setWard(value)}
                                                filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {wardsFilter.map((item) => (
                                                <Option key={item.code} value={item.code}>
                                                    {item.name_with_type}
                                                </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
               

                                    {/* <Form.Item name="education" label="Học vấn">
                                        <Input />
                                    </Form.Item> */}
                                    {/* <Form.Item
                                        name="hire"
                                        label="Ngày bắt đầu/kết thúc HĐ"
                                    >
                                        <DatePicker.RangePicker
                                            className="w-full"
                                            allowEmpty={[true, true]}
                                        />
                                    </Form.Item> */}
                                    {/* <Row>
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
                                    </Row> */}
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
export default CreateEditUser;
