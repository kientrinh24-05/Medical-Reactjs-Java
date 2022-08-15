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
import { usePatienttActions } from "@/_actions";
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

  var [roomType1 ,setRoomType] = useState('');

  console.log(roomType1 , 'roomType1');

  const [genders, setGenders] = useState([
    { name: "Nam" , code: 0},
    { name: "Nữ" , code: 1},
  ]);


  const [objectTypes, setObjectTypes] = useState([
    { name: "Miễn phí" , code: 1 },
    { name: "Thu phí" , code: 2 },
    { name: "BHYT" , code: 3 },
  ]);

  console.log(objectTypes , 'objectTypes');
  const [isPaids, setisPaids] = useState([
    { name: "Chưa thanh toán" , code: 0 },
    { name: "Đã thanh toán"  , code: 1},
  ]);


  const [gender, setGender] = useState(genders[0]?.code);
  const [isPaid, setisPaid] = useState(isPaids[0]?.name);
  const [objectType, setobjectType] = useState(objectTypes[0]?.name);



  const applyFor = pathname.split("/")[2];
  const type = convertTypeToInt(applyFor);

  const actions = usePatienttActions();

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
      cardNumber: data.data.cardNumber,
      gender: data.data.gender,
      cccd: data.data.cccd,
      phone: data.data.phone,
      isPaid: data.data.isPaid,
      name: data.data.name,
      number: data.data.number,
      objectType: data.data.objectType,
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
        isEdit ? "Cập nhật bệnh nhân thành công" : "Thêm mới bệnh nhân thành công"
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
        title={isEdit ? "Cập nhật bệnh nhân" : "Thêm mới bệnh nhân"}
        onBack={() => navigate("/patient")}
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
                  <Col md={12}>
                    <Form.Item
                      name="code"
                      label="Mã bệnh nhân"
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
                  <Col md={12}>
                    <Form.Item
                      name="name"
                      label="Tên bệnh nhân"
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
                      name="number"
                      label="Năm sinh"
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
                      name="cccd"
                      label="Căn cước"
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
                      name="phone"
                      label="Số điện thoại"
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
                      name="cardNumber"
                      label="Số BYHT"
                      rules={[
                        {
                          required: false,
                          message: "Vui lòng nhập nội dung",
                        },
                      ]}
                    >
                    
                      <Input  disabled={roomType1 != 3 ? true : false}/>
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item
                      name="gender"
                      label="Giới tính"
                      rules={[
                        {
                          required: false,
                          message: "Vui lòng nhập tên danh mục",
                        },
                      ]}
                    >
                      <Select
                        name="gender"
                        defaultValue={genders[0]?.code}
                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children"
                        onChange={(value) => setGender(value)}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {genders.map((item) => (
                          <Option key={item.code} value={item.code}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item
                      name="objectType"
                      label="Đối tượng"
                      rules={[
                        {
                          required: false,
                          message: "Vui lòng nhập tên danh mục",
                        },
                      ]}
                    >
                      <Select
                        name="objectType"
                        defaultValue={objectTypes[0]?.code}
                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children"
                      onChange={(value) => setRoomType(value)}
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      >
                        {objectTypes.map((item) => (
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
                    onClick={() => navigate("/patient/" + applyFor)}
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
