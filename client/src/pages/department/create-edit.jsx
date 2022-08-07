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
import { useDepartmentActions } from "@/_actions";
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

  const [departmentCodeBCs, setDepartmentCodeBCs] = useState([
    { name: "K01" , code: 1},
    { name: "K02" , code: 2},
    { name: "K03" , code: 3},
    { name: "K04" , code: 4},
    { name: "K05" , code: 5},
    { name: "K06" , code: 6},
  ]);


  const [departmentTypes, setDepartmentTypes] = useState([
    { name: "Phòng bệnh" , code: 1 },
    { name: "Phòng khám /ngoại trú" , code: 2 },
    { name: "Điều trị nội trú" , code: 3 },
    { name: "Khoa xét nghiệm" , code: 4 },
    { name: "Khoa chẩn đoán hình ảnh", code: 5  },
  ]);
  const [roomTypes, setRoomTypes] = useState([
    { name: "Phòng bình thường" , code: 1 },
    { name: "Phòng dịch vụ 1"  , code: 2},
    { name: "Phòng dịch vụ 2" , code: 3 }
  ]);
  const [Levels, setLevels] = useState([
    { name: 1 },
    { name: 2 },
    { name: 3 },
  ]);

  const [departmentCodeBC, setDepartmentCodeBC] = useState(departmentCodeBCs[0]?.code);
  const [departmentType, setDepartmentType] = useState(departmentTypes[0]?.name);
  const [roomType, setRoomType] = useState(roomTypes[0]?.name);
  const [level, setLevel] = useState(Levels[0]?.name);


  const applyFor = pathname.split("/")[2];
  const type = convertTypeToInt(applyFor);

  const actions = useDepartmentActions();

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
      departmentCodeBC: data.data.departmentCodeBC,
      departmentType: data.data.departmentType,
      level: data.data.level,
      name: data.data.name,
      roomType: data.data.roomType,
      typeOffice: data.data.typeOffice,
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
        ...values, departmentCodeBC , departmentType , roomType , level ,
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
        onBack={() => navigate("/department")}
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
                      label="Mã phòng ban"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mã phòng ban",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={10}>
                    <Form.Item
                      name="name"
                      label="Tên phòng ban"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên phòng ban",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={10}>
                    <Form.Item
                      name="departmentCodeBC"
                      label="Mã BC BHYT"
                      rules={[
                        {
                          message: "Vui lòng nhập tên danh mục",
                        },
                      ]}
                    >
                      <Select
                        name="departmentCodeBC"
                        defaultValue={departmentCodeBCs[0]?.code}
                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children"
                        onChange={(value) => setDepartmentCodeBC(value)}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {departmentCodeBCs.map((item) => (
                          <Option key={item.code} value={item.code}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col md={10}>
                    <Form.Item
                      name="departmentType"
                      label="Loại phòng ban"
                      rules={[
                        {
                          message: "Vui lòng nhập tên danh mục",
                        },
                      ]}
                    >
                      <Select
                        name="departmentType"
                        defaultValue={departmentTypes[0]?.name}
                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children"
                      onChange={(value) => setDepartmentType(value)}
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      >
                        {departmentTypes.map((item) => (
                          <Option key={item.code} value={item.code}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col md={10}>
                    <Form.Item
                      name="roomType"
                      label="Loại phòng ban"
                      rules={[
                        {
                          message: "Vui lòng nhập tên danh mục",
                        },
                      ]}
                    >
                      <Select
                        name="roomType"
                        defaultValue={roomTypes[0]?.name}
                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children"
                      onChange={(value) => setRoomType(value)}
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      >
                        {roomTypes.map((item) => (
                          <Option key={item.code} value={item.code}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col md={10}>
                    <Form.Item
                      name="level"
                      label="Cấp"
                      rules={[
                        {
                          message: "Vui lòng nhập tên danh mục",
                        },
                      ]}
                    >
                      <Select
                        name="level"
                        defaultValue={Levels[0]?.name}
                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children"
                      onChange={(value) => setLevel(value)}
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      >
                        {Levels.map((item) => (
                          <Option key={item.name} value={item.name}>
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
