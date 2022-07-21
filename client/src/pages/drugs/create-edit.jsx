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
  InputNumber,
  Switch
} from "antd";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { usePrugsActions } from "@/_actions";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userCan } from "@/_state";
import { convertTypeToInt } from "./index";

const CreateRole = ({ }) => {
  const { pathname } = useLocation();

  const [companyType, setServices] = useState([
    { name: "Out soure" },
    { name: "Product" },
  ]);

  const [loaiThuocs, setloaiThuocs] = useState([
    { name: "Thuốc tây y" , code: 1},
    { name: "Chế phẩm Y học cổ truyền" , code: 2},
    { name: "Vị thuốc y học cổ truyền" , code: 3},
  ]);

  const [loaiVatTus , setloaiVatTus ] = useState([
    { name: "Bơm kim tiêm" , code: 1 },
    { name: "Dung môi" , code: 2 },
    { name: "Hóa chất XN'" , code: 3 },
    { name: "Hộp an toàn" , code: 4 },
    { name: "Thuốc", code: 5  },
    { name: "Vắc xin", code: 6  },
    { name: "Vật tư y tế", code: 7 },
  ]);
  const [donViTinhs, setdonViTinhs] = useState([
    { name: "Bình" , code: 1 },
    { name: "Can"  , code: 2},
    { name: "Chiếc" , code: 3 },
    { name: "Gói" , code: 4 },
    { name: "Gram" , code: 5 },
    { name: "Lít" , code: 6 },
    { name: "Lọ" , code: 7 },
    { name: "Ml" , code: 8 },
    { name: "Ống" , code: 9 },
    { name: "Tuýp" , code: 10 },
    { name: "Vỉ" , code: 11 },
    { name: "Viên" , code: 12 },
  ]);
  const [duongDungs, setduongDungs] = useState([
    { name: "Áp ngoài da" , code: 1 },
    { name: "Bôi"  , code: 2},
    { name: "Hít" , code: 3 },
    { name: "Đặt dưới lưỡi" , code: 4 },
    { name: "Ngậm" , code: 5 },
    { name: "Nhai" , code: 6 },
    { name: "Nhỏ mắt" , code: 7 },
    { name: "Nhỏ mũi" , code: 8 },
    { name: "Nhỏ tai" , code: 9 },
    { name: "Tiêm" , code: 10 },
    { name: "Uống" , code: 11 },
  ]);

  const [loaiThuoc, setloaiThuoc] = useState(loaiThuocs[0]?.code);
  const [loaiVatTu, setloaiVatTu] = useState(loaiVatTus[0]?.name);
  const [donViTinh, setdonViTinh] = useState(donViTinhs[0]?.name);
  const [duongDung, setduongDung] = useState(duongDungs[0]?.name);


  const applyFor = pathname.split("/")[2];
  const type = convertTypeToInt(applyFor);

  const actions = usePrugsActions();
  const { TextArea } = Input;
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
      code: data.data.code,
      name: data.data.name,
      loaiThuoc: data.data.loaiThuoc,
      loaiVatTu: data.data.loaiVatTu,
      donViTinh: data.data.donViTinh,
      duongDung: data.data.duongDung,
      quyCach: data.data.quyCach,
      congDung: data.data.congDung,
      soDangKy: data.data.soDangKy,
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
        isEdit ? "Cập nhật phòng ban thành công" : "Thêm mới phòng ban thành công"
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
        title={isEdit ? "Cập nhật phòng ban" : "Thêm mới phòng ban"}
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
          <Col span={18}>
            <Card title="Thông tin">
              {loading ? (
                <Spin />
              ) : (
                <>      <Row gutter={12}>
                  <Col md={10}>
                    <Form.Item
                      name="code"
                      label="Mã thuốc"
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
                      label="Tên thuốc"
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
                      name="loaiThuoc"
                      label="Loại thuốc"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên danh mục",
                        },
                      ]}
                    >
                      <Select
                        name="loaiThuoc"
                        defaultValue={loaiThuocs[0]?.code}
                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children"
                        onChange={(value) => setloaiThuoc(value)}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {loaiThuocs.map((item) => (
                          <Option key={item.code} value={item.code}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col md={10}>
                    <Form.Item
                      name="loaiVatTu"
                      label="Loại vật tư"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên danh mục",
                        },
                      ]}
                    >
                      <Select
                        name="loaiVatTu"
                        defaultValue={loaiVatTus[0]?.name}
                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children"
                      onChange={(value) => setloaiVatTu(value)}
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      >
                        {loaiVatTus.map((item) => (
                          <Option key={item.code} value={item.code}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col md={10}>
                    <Form.Item
                      name="donViTinh"
                      label="Đơn vị tính"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên danh mục",
                        },
                      ]}
                    >
                      <Select
                        name="donViTinh"
                        defaultValue={donViTinhs[0]?.name}
                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children"
                      onChange={(value) => setdonViTinh(value)}
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      >
                        {donViTinhs.map((item) => (
                          <Option key={item.code} value={item.code}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col md={10}>
                    <Form.Item
                      name="duongDung"
                      label="Đường dụng"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên danh mục",
                        },
                      ]}
                    >
                      <Select
                        name="duongDung"
                        defaultValue={duongDungs[0]?.name}
                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children"
                        onChange={(value) => setduongDung(value)}
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      >
                        {duongDungs.map((item) => (
                          <Option key={item.code} value={item.code}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col md={10}>
                    <Form.Item
                      name="soDangKy"
                      label="Sổ đăng ký"
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
                      name="congDung"
                      label="Công dụng"
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
                      name="quyCach"
                      label="Quy cách"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập nội dung",
                        },
                      ]}
                    >
                      <InputNumber min={1} max={1000} defaultValue={1}/>
                    </Form.Item>
                  </Col>
                </Row>
                </>
              )}
            </Card>
          </Col>

          <Col span={4}>
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
                    onClick={() => navigate("/drugs/" + applyFor)}
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
