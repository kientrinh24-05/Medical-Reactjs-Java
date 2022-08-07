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
import { useProductActions , useCategoryActions } from "@/_actions";
import { categoryAtom } from "@/_state";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userCan } from "@/_state";
import { convertTypeToInt } from "./index";

const CreateRole = ({ }) => {
  const { pathname } = useLocation();


  const categorys = useRecoilValue(categoryAtom);
  const [category, setCategory] = useState(categorys[0]?.name);

  const applyFor = pathname.split("/")[2];
  const type = convertTypeToInt(applyFor);

  const actions = useProductActions();
  const actionsCategory = useCategoryActions();

  const loadDataCategory = async () => {
    setLoading(true);
    await actionsCategory.getList();
    setLoading(false);
};

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
      code: data.data.code,
      nameVi: data.data.nameVi,
      nameEN: data.data.nameEN,
      categoryId: data.data.category.id,
      price: data.data.price,
      priceBHYT: data.data.priceBHYT,
    });
    setLoading(false);
  };

  useEffect(() => {
    loadDataCategory();
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
        isEdit ? "Cập nhật dịch vụ thành công" : "Thêm mới dịch vụ thành công"
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
        title={isEdit ? "Cập nhật dịch vụ" : "Thêm mới dịch vụ"}
        onBack={() => navigate("/product")}
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
                      label="Mã dịch vụ"
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
                      name="nameVi"
                      label="Tên dịch vụ"
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
                      name="nameEN"
                      label="Tên Tiếng Anh"
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
                      name="categoryId"
                      label="Nhóm dịch vụ"
                      rules={[
                        {
                          required: false,
                          message: "Vui lòng nhập tên danh mục",
                        },
                      ]}
                    >
                      <Select
                        name="categoryId"
                        defaultValue={categorys[0]?.id}
                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children"
                        onChange={(value) => setCategory(value)}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {categorys.items.map((item) => (
                          <Option key={item.id} value={item.id}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col md={10}>
                    <Form.Item
                      name="price"
                      label="Giá dịch vụ"
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
                      name="priceBHYT"
                      label="Giá BHYT"
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
