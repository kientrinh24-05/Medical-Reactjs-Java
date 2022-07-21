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
  Switch
} from "antd";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSuppliertActions } from "@/_actions";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userCan } from "@/_state";
import { convertTypeToInt } from "./index";

const CreateRole = ({ }) => {
  const { pathname } = useLocation();

  const [companyTypes, setCompanyTypes] = useState([
    { name: "Trong nước" , code: 0},
    { name: "Ngoài nước"  , code: 1},
  ]);

  const [companyType, setCompanyType] = useState(companyTypes[0]?.name);

  const applyFor = pathname.split("/")[2];
  const type = convertTypeToInt(applyFor);

  const actions = useSuppliertActions();

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id } = useParams();
  const isEdit = !!id;

  const [saveLoading, setSaveLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadDetail = async () => {
    setLoading(true);
    const { data } = await actions.show(id);
    console.log(data);
    // const { result } = data ?? {};
    // console.log(result);
    form.setFieldsValue({
      code: data.data.code,
      contact:data.data.contact,
      email: data.data.email,
      address: data.data.address,
      fax: data.data.fax,
      manager: data.data.manager,
      mst:data.data.mst,
      name:data.data.name,
      nameEn:data.data.nameEn,
      phone: data.data.phone,
      type: data.data.type,
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
        ...values, companyType,
        apply_for: type,
      };
      console.log(isEdit);
      if (isEdit) {
        await actions.update(data);
      } else {
        await actions.create(data);
        form.resetFields();
      }
      setSaveLoading(false);

      message.success(
        isEdit ? "Cập nhật danh mục thành công" : "Thêm mới danh mục thành công"
      );
    } catch (error) {
      console.log(error);
      message.error(error.response.data.message);
      setSaveLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={isEdit ? "Cập nhật danh mục" : "Thêm mới danh mục"}
        onBack={() => navigate("/category")}
      />

      <Form
        form={form}
        onFinish={onSave}
        name="form"
        labelCol={{
          span: 6,
        }}
      >

        <Row gutter={12}>
          <Col span={16}>
            <Card title="Thông tin">
              {loading ? (
                <Spin />
              ) : (
                <>      <Row gutter={12}>
                  <Col md={10}>
                    <Form.Item
                      name="code"
                      label="Mã nhà cung cấp"
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
                      label="Tên nhà cung cấp"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập nội dung",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={10}>
                    <Form.Item
                      name="nameEn"
                      label="Tên tiếng anh"
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
                      name="phone"
                      label="Điện thoại"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập nội dung",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={10}>
                    <Form.Item
                      name="address"
                      label="Địa chỉ"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập nội dung",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={10}>
                    <Form.Item
                      name="fax"
                      label="Fax"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập nội dung",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={10}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập nội dung",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={10}>
                    <Form.Item
                      name="mst"
                      label="Mã số thuế"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập nội dung",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={10}>
                    <Form.Item
                      name="manager"
                      label="Giám đốc"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập nội dung",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={10}>
                    <Form.Item
                      name="contact"
                      label="Người liên hệ"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập nội dung",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item
                      name="type"
                      label="Loại hình công ty"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên danh mục",
                        },
                      ]}
                    >
                      <Select
                        name="type"
                        defaultValue={companyTypes[0]?.name}
                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children"
                      onChange={(value) => setCompanyType(value)}
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      >
                        {companyTypes.map((item) => (
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
                    onClick={() => navigate("/category/" + applyFor)}
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
