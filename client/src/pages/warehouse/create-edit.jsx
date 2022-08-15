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
import { useWareHouseActions } from "@/_actions";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userCan } from "@/_state";
import { convertTypeToInt } from "./index";

const CreatWareHouse = ({ }) => {
  const { pathname } = useLocation();

  const [wareHouseTypes, setWareHouseTypes] = useState([
    { name: "Kho chẵn", code: 0 },
    { name: "Kho cơ số", code: 1 },
    { name: "Kho lẻ", code: 2 },
    { name: "Quầy thuốc", code: 3 },
  ]);

  const [wareHouseType, setWareHouseType] = useState(wareHouseTypes[0]?.name);


  const applyFor = pathname.split("/")[2];
  const type = convertTypeToInt(applyFor);

  const actions = useWareHouseActions();

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id } = useParams();
  const isEdit = !!id;

  const [saveLoading, setSaveLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadDetail = async () => {
    setLoading(true);
    const { data } = await actions.show(id);
    // console.log(data.data);
    // const { result } = data ?? {};
    // console.log(result);
    form.setFieldsValue({
      name: data.data.name,
      code: data.data.code,
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
        ...values,
        apply_for: type,
      };
      console.log(isEdit);
      if (isEdit) {
        await actions.update(id, data);
      } else {
        await actions.create(data);
        form.resetFields();
      }
      setSaveLoading(false);

      message.success(
        isEdit ? "Cập nhật kho dược thành công" : "Thêm mới kho dược thành công"
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
        title={isEdit ? "Cập nhật kho dược" : "Thêm mới kho dược"}
        onBack={() => navigate("/warehouse")}
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
          <Col span={14}>
            <Card title="Thông tin">
              {loading ? (
                <Spin />
              ) : (
                <>      <Row gutter={12}>


                  <Col md={13}>
                    <Form.Item
                      name="code"
                      label="Mã kho"
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

                  <Col md={13}>
                    <Form.Item
                      name="name"
                      label="Tên kho"
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

                  <Col md={13}>
                    <Form.Item
                      name="type"
                      label="Loại kho"
                      rules={[
                        {
                          required: false,
                          message: "Vui lòng nhập tên kho dược",
                        },
                      ]}
                    >
                      <Select
                        name="type"
                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children"
                        onChange={(value) => setWareHouseType(value)}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {wareHouseTypes.map((item) => (
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
                    onClick={() => navigate("/warehouse/" + applyFor)}
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
export default CreatWareHouse;
