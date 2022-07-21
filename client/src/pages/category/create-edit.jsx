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
import { useCategoryActions } from "@/_actions";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userCan } from "@/_state";
import { convertTypeToInt } from "./index";

const CreateRole = ({ }) => {
  const { pathname } = useLocation();

  const [services, setServices] = useState([
    { name: "Khám răng" },
    { name: "Khám hàm" },
    { name: "Khám mặt" },
  ]);

  const applyFor = pathname.split("/")[2];
  const type = convertTypeToInt(applyFor);

  const actions = useCategoryActions();

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
      description: data.data.description,
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
        ...values,
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
        isEdit ? "Cập nhật nhóm dịch vụ thành công" : "Thêm mới nhóm dịch vụ thành công"
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
        title={isEdit ? "Cập nhật nhóm dịch vụ" : "Thêm mới nhóm dịch vụ"}
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
          <Col span={12}>
            <Card title="Thông tin">
              {loading ? (
                <Spin />
              ) : (
                <>      <Row gutter={12}>
                  <Col md={13}>
                    <Form.Item
                      name="name"
                      label="Tên nhóm DV"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mã..",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={13 }>
                    <Form.Item
                      name="description"
                      label="Nội dung"
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
                </Row>
                </>
              )}
            </Card>
          </Col>

          <Col span={8}>
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
