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
  Checkbox,
  Select,
  DatePicker,
  Divider,
  Table,
  Switch
} from "antd";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { warehousedrugAtom,patientAtom, usersAtom ,warehouseAtom  } from "@/_state";
import { useDepartmentActions, useWareHouseDrugActions, usePrugsActions, usePatienttActions, useProductActions, useUserActions, useCategoryActions , useWareHouseActions} from "@/_actions";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userCan, categoryAtom, productAtom, drugsAtom } from "@/_state";
import { convertTypeToInt } from "./index";
import Calendar from "../../components/calendar";

const CheckboxGroup = Checkbox.Group;

const CreateRole = ({ }) => {
  const { pathname } = useLocation();

  const [companyType, setServices] = useState([
    { name: "Out soure" },
    { name: "Product" },
  ]);

  const [departmentCodeBCs, setDepartmentCodeBCs] = useState([
    { name: "K01", code: 1 },
    { name: "K02", code: 2 },
    { name: "K03", code: 3 },
    { name: "K04", code: 4 },
    { name: "K05", code: 5 },
    { name: "K06", code: 6 },
  ]);

  const [results, setResults] = useState([
    { name: "Khỏi", code: 1 },
    { name: "Đở", code: 2 },
    { name: "Không thay đổi", code: 3 },
    { name: "Diễn biến xấu", code: 4 },
    { name: "Tử vong", code: 5 },
  ]);

  const [diseases, setDiseases] = useState([
    { name: "Bệnh uốn ván", code: 1 },
    { name: "Bệnh Rubella", code: 2 },
    { name: "Bệnh viêm gan vi rút", code: 3 },
    { name: "Bệnh viêm màng não do não mô cầu", code: 4 },
    { name: "Bệnh sốt vàng", code: 5 },
    { name: "Bệnh cúm A/H5N1", code: 5 },
  ]);
  const [Includediseases, setIncludeDiseases] = useState([
    { name: "Bệnh sốt vàng", code: 1 },
    { name: "Bệnh sốt rét", code: 2 },
    { name: "Bệnh sởi", code: 3 },
    { name: "Bệnh tay-chân-miệng", code: 4 },
    { name: "Bệnh mắt hột", code: 5 },
    { name: "Bệnh cúm A/H5N1", code: 5 },
  ]);


  const [departmentTypes, setDepartmentTypes] = useState([
    { name: "Phòng bệnh", code: 1 },
    { name: "Phòng khám /ngoại trú", code: 2 },
    { name: "Điều trị nội trú", code: 3 },
    { name: "Khoa xét nghiệm", code: 4 },
    { name: "Khoa chẩn đoán hình ảnh", code: 5 },
  ]);

  const [subjects, setSubjects] = useState([
    { name: "BHYT", code: 1 },
    { name: "Thu phí", code: 2 },
    { name: "Miễn phí", code: 3 }
  ]);

  const [lines, setLines] = useState([
    { name: "Đúng tuyến", code: 1 },
    { name: "Cấp cứu", code: 2 },
    { name: "Trái tuyến", code: 3 },
    { name: "Thông tuyến", code: 4 }
  ]);

  const [areas, setAreas] = useState([
    { name: "K1", code: 1 },
    { name: "K2", code: 2 },
    { name: "K3", code: 3 },
    { name: "K4", code: 4 }
  ]);

  const [roomTypes, setRoomTypes] = useState([
    { name: "Phòng bình thường", code: 1 },
    { name: "Phòng dịch vụ 1", code: 2 },
    { name: "Phòng dịch vụ 2", code: 3 }
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




  const [result, setResult] = useState(results[0]?.code);
  const [disease, setDisease] = useState(diseases[0]?.code);
  const [includedisease, setIncludeDisease] = useState(Includediseases[0]?.code);
  const [subject, setSubject] = useState(subjects?.name);
  const [area, setArea] = useState(areas?.name);
  const [line, setLine] = useState(lines?.name);

  const [loadingRow, setLoadingRow] = useState(null);


  const applyFor = pathname.split("/")[2];
  const type = convertTypeToInt(applyFor);

  const actions = useDepartmentActions();
  // const actionsWareHouseDrug = useInvoicesActions();
  const actionsWareHouseDrug = useWareHouseDrugActions();
  const actionsPatient = usePatienttActions();
  const userAction = useUserActions();
  const actionsCategory = useCategoryActions();
  const actionsProduct = useProductActions();
  const actionsPrugs = usePrugsActions();
  const actionsWareHouse = useWareHouseActions();

  const patientItems = useRecoilValue(patientAtom);



  const users = useRecoilValue(usersAtom);
  const category = useRecoilValue(categoryAtom);
  const product = useRecoilValue(productAtom);
  const drugs = useRecoilValue(drugsAtom);
  const warehousedrug = useRecoilValue(warehouseAtom);
  const warehouseItem = warehousedrug.items;

  const categoryItem = category.items;




  const [categoryitem, setCategoryItem] = useState(categoryItem[0]?.name);

  const [details, setDetails] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);


  useEffect(() => {
    const total = details.reduce((item1, item2) => {
      return item1 + item2.price * item2.quantity
    }, 0)
    setTotalAmount(total);
  }, [details])
 

  const pushData = (record) => {

    console.log(record , 'record');
 
  
    const index = details.map(item => item.drugId).indexOf(record.id);

    if (index !== -1) {
      const newDetails = [...details];
      newDetails[index].quantity++;
      setDetails(newDetails);
    } else {
      const newDetails = [...details];
      newDetails.push(
        {
          drugId: record.id,
          name: record.name,
          quantity: 1,
        }
      )
      setDetails(newDetails);
    }
    // const newDetails = [...details];
    // newDetails.map(item => {
    //   var total = item.price * item.quantity;
    //   setTotalAmount(total);
    // })

  }


  const loadDataProduct = async (productId) => {
    await actionsProduct.getListDetail(productId);
  }

  const loadDataPatient = async () => {
    setLoading(true);
    await actionsWareHouse.getList();
    await actionsCategory.getList();
    await actionsPrugs.getList();
    await actionsPatient.getList();
    await userAction.getList({
      pageNumber: 1,
      pageSize: 1000,
      searchKey: "",
      sortCase: 1,
      status: 1,
    });

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
    const { data } = await actionsWareHouseDrug.show(id);

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
    loadDataPatient();
    if (id) {
      loadDetail();
    }
  }, []);



  const handleChangeType = (valueChanged) => {
    setValueType(valueChanged.target.value);
  }



  const onSave = async () => {
    try {
      const values = form.getFieldsValue();
      setSaveLoading(true);
      details.forEach(object => {
        return delete object['name'];
      });

      const data = {
        ...values,
        details,
      };
      console.log(isEdit);
      if (isEdit) {
        await actionsWareHouseDrug.update(data);
      } else {
 
        console.log(data);
        await actionsWareHouseDrug.create(data);
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

        <Row gutter={14}>
  
          <Col span={24} className="mt-4">
            <Card title="Thông tin kho hàng">
              {loading ? (
                <Spin />
              ) : (
                <>      <Row gutter={12}>

                  <Col md={10}>
                    <Form.Item
                      name="warehouseId"
                      label="Tên kho hàng"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên danh mục",
                        },
                      ]}
                    >
                      <Select
                        name="warehouseId"
                        defaultValue={warehouseItem[0]?.name}
                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children"
                        // onChange={(value) => setDepartmentCodeBC(value)}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {warehouseItem.map((item) => (
                          <Option key={item.id} value={item.id}>
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

          <Col span={24} className="mt-4">

            <Card title="Danh sách thuốc">
              <Row gutter={12}>
                <Col md={12}>
                  {loading ? (
                    <Spin />
                  ) : (
                    <Table
                      dataSource={drugs.items}
                      pagination={false}
                      columns={[
                        {
                          title: "STT",
                          dataIndex: "id",
                        },
                        {
                          title: "Tên thuốc",
                          dataIndex: "name",
                        },

                        {
                          title: "Loại thuốc",
                          dataIndex: "loaiThuoc",
                          render: (text, record) => (
                            <>
                              {
                                typeDrugs[text]
                              }
                            </>
                          ),
                        },
                        {
                          title: "Công dụng",
                          dataIndex: "duongDung",
                          render: (text, record) => (
                            <>
                              {
                                usageDrugs[text]
                              }
                            </>
                          ),
                        },
                        {
                          title: "Hành động",
                          width: 150,
                          render: (_, record) => (
                            <div className="text-center">
                              {loadingRow == record.id ? (
                                <Spin />
                              ) : (
                                <Space size="middle">

                                  <a
                                    className="text-blue-400 text-center"
                                    onClick={() => pushData(record)
                                    }
                                  >
                                    +
                                  </a>


                                </Space>
                              )}
                            </div>
                          ),
                        },
                      ]}

                    // footer={() => `Tổng số danh mục ${pagination.total}`}
                    // onChange={handleTableChange}
                    ></Table>
                  )}
                </Col>

                <Col md={12}>
                  {loading ? (
                    <Spin />
                  ) : (
                    <Table
                      dataSource={details}
                      pagination={false}
                      columns={[
                        {
                          title: "Mã số thuốc",
                          dataIndex: "drugId",
                        },
                        {
                          title: "Tên thuốc",
                          dataIndex: "name",
                        },


                        {
                          title: "Số lượng",
                          dataIndex: "quantity",
                          render: (quantity) => quantity
                        },

                      ]}
                      loading={loading}

                    ></Table>
                  )}
                  
                </Col>

              

              </Row>

             

            </Card>
          </Col>

          <Col span={8} className="mt-4">
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
