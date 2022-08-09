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
  Switch,
  InputNumber
} from "antd";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { patientAtom, usersAtom } from "@/_state";
import { useDepartmentActions, useInvoicesActions, usePrugsActions, usePatienttActions, useProductActions, useUserActions, useCategoryActions } from "@/_actions";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userCan, categoryAtom, productAtom, drugsAtom } from "@/_state";
import { convertTypeToInt } from "./index";
import Calendar from "../../components/calendar";
import moment from "moment";
import { formatMoney } from "../../utils/helper";

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
    { name: "Thu phí", code: 1 },
    { name: "Miễn phí", code: 2 }
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
  const [numberPatient, setnumberPatient] = useState("");
  const [cardNumber, setcardNumber] = useState("");
  const [codepatient, setcodepatient] = useState("");

  const [loadingRow, setLoadingRow] = useState(null);


  const applyFor = pathname.split("/")[2];
  const type = convertTypeToInt(applyFor);

  const actions = useDepartmentActions();
  const actionsInvoces = useInvoicesActions();
  const actionsPatient = usePatienttActions();
  const userAction = useUserActions();
  const actionsCategory = useCategoryActions();
  const actionsProduct = useProductActions();
  const actionsPrugs = usePrugsActions();

  const patientItems = useRecoilValue(patientAtom);
  const users = useRecoilValue(usersAtom);
  const category = useRecoilValue(categoryAtom);
  const product = useRecoilValue(productAtom);
  const drugs = useRecoilValue(drugsAtom);
  const patientItem = patientItems.items;
  const userItem = users.items;
  const categoryItem = category.items;


  const [categoryitem, setCategoryItem] = useState(categoryItem[0]?.name);

  const [details, setDetails] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);


  useEffect(() => {
    const total = details.reduce((item1, item2) => {
      return item1 + item2.price * item2.quantity
    }, 0)
    setTotalAmount(total);

    console.log(details ,'details');

    const totalMount = details.map(item => {
      console.log(item);
    })

    console.log(totalMount);
  }, [details])


  const pushData = (record) => {

    console.log(record ,'record');
    const index = details.map(item => item.drugId).indexOf(record.id);

    if (index !== -1) {
      const newDetails = [...details];
      newDetails[index].quantity++;
      newDetails[index].amout = record.price * newDetails[index].quantity;
      setDetails(newDetails);
    } else {
      const newDetails = [...details];
      newDetails.push(
        {
          amout: (record.price * quantityDrugs),
          drugId: record.id,
          price: record.price ? record.price : 10000,
          quantity: quantityDrugs,
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

  const OnchangePatientId = async (patientId) => {
    const dataPatient = await actionsPatient.show(patientId);
    const newDataPatient = { ...dataPatient.data.data };

    setnumberPatient(newDataPatient.number);
    setcardNumber(newDataPatient.cardNumber);
    setcodepatient(newDataPatient.code);
    console.log(newDataPatient);
  }

  console.log('numberPatient: ', numberPatient);

  const loadDataPatient = async () => {
    setLoading(true);
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
  const [detailsDrugs, setdetailsDrugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantityDrugs, setquantityDrugs] = useState(1);

  const loadDetail = async () => {
    setLoading(true);
    const { data } = await actionsInvoces.show(id);

    form.setFieldsValue({
      objectType: data.data.objectType,
      numberBHYT: data.data.numberBHYT,
      fromDate: moment(data.data.fromDate).format("DD-MM-YYYY HH:mm:ss"),
      toDate: moment(data.data.toDate).format("DD-MM-YYYY HH:mm:ss"),
      dateStart: moment(data.data.dateStart).format("DD-MM-YYYY HH:mm:ss"),
      dateEnd: moment(data.data.dateEnd).format("DD-MM-YYYY HH:mm:ss"),
      routingType: data.data.routingType,
      patientId: data.data.patient.name,
      form: data.data.form,
      typeOffice: data.data.typeOffice,
      trieuChung: data.data.trieuChung,
      benhChinh: data.data.benhChinh,
      dienGiaiBenhChinh: data.data.dienGiaiBenhChinh,
      benhKemTheo: data.data.benhKemTheo,
      dienGiaiBenhKemTheo: data.data.dienGiaiBenhKemTheo,
      tuVanDieuTri: data.data.tuVanDieuTri,
      dienBienDieuTri: data.data.dienBienDieuTri,
      ketQuaKham: data.data.ketQuaKham,
      dateStartString: data.data.dateStart,
      dateEndString: data.data.dateEnd,
      userId: data.data.users.id,
      productId: data.data.product.nameVi,
    });

    setdetailsDrugs(data.data.invoiceDetails);
    setTotalAmount(data.data.totalAmount);

    setLoading(false);
  };

  useEffect(() => {
    loadDataPatient();
    if (id) {
      loadDetail();
    }
  }, []);


  const options = [
    { label: 'Chuyển tuyến điều trị', value: 1 },
    { label: 'Cấp cứu', value: 2 },
    { label: 'Nơi khác đến', value: 3 },
  ];

  const [valueType, setValueType] = useState(1);

  const handleChangeType = (valueChanged) => {
    setValueType(valueChanged.target.value);
  }



  const onChangeNumber = (value) => {

    setquantityDrugs(value)
  };



  const onSave = async () => {
    try {
      const values = form.getFieldsValue();
      setSaveLoading(true);
      const data = {
        id,
        ...values,
        details,
        apply_for: type,
      };
      if (isEdit) {
        await actionsInvoces.update(data);
      } else {
        await actionsInvoces.create(data);
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

  var typeDrugs = {
    1: 'Thuốc tây y',
    2: 'Chế phẩm Y học cổ truyền',
    3: 'Vị thuốc y học cổ truyền',
  }

  var unitDrugs = {
    1: 'Bình',
    2: 'Can',
    3: 'Chiếc',
    4: 'Gói',
    5: 'Gram',
    6: 'Lít',
    7: 'Lọ',
    8: 'Ml',
    9: 'Ống',
    10: 'Tuýp',
    11: 'Vỉ',
    12: 'Viên'
  }

  var usageDrugs = {
    1: 'Áp ngoài da',
    2: 'Bôi',
    3: 'Hít',
    4: 'Đặt dưới lưỡi',
    5: 'Ngậm',
    6: 'Nhai',
    7: 'Nhỏ mắt',
    8: 'Nhỏ mũi',
    9: 'Nhỏ tai',
    10: 'Tiêm',
    11: 'Uống',
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? "Cập nhật khám chữa bệnh" : "Thêm mới dịch vụ khám chữa bệnh"}
        onBack={() => navigate("/medical_examination")}
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
          <Col span={24}>
            <Card title="Thông tin thẻ BHYT">
              {loading ? (
                <Spin />
              ) : (
                <>      <Row gutter={12}>

                  <Col md={10}>
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

                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children"
                        onChange={(value) => setSubject(value)}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {subjects.map((item) => (
                          <Option key={item.code} value={item.code}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>

                      <Checkbox className="ml-5">Trẻ em không thẻ</Checkbox>
                    </Form.Item>

                  </Col>
                  <Col md={10}>
                    <Form.Item
                      name="numberBHYT"
                      label="Số thẻ BHYT"
                      rules={[
                        {
                          required: false,
                          message: "Vui lòng nhập nội dung",
                        },
                      ]}

                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={10}>

                    {
                      !isEdit && (
                        <Form.Item
                          name="fromDateString"
                          label="Ngày bắt đầu"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập nội dung",
                            },
                          ]}
                        >
                          <Calendar placeholder="Chọn ngày" />
                        </Form.Item>
                      )
                    }

                    {
                      isEdit && (
                        <Form.Item
                          name="fromDate"
                          label="Ngày bắt đầu"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập nội dung",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      )
                    }

                  </Col>

                  <Col md={10}>
                    {
                      !isEdit && (
                        <Form.Item
                          name="toDateString"
                          label="Ngày kết thúc"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập nội dung",
                            },
                          ]}
                        >
                          <Calendar placeholder="Chọn ngày" />
                        </Form.Item>
                      )
                    }

                    {
                      isEdit && (
                        <Form.Item
                          name="toDate"
                          label="Ngày kết thúc"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập nội dung",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      )
                    }
                  </Col>



                  <Col md={10}>
                    <Form.Item
                      name="routingType"
                      label="Loại tuyến"
                      rules={[
                        {
                          required: false,
                          message: "Vui lòng nhập tên danh mục",
                        },
                      ]}
                    >
                      <Select
                        name="routingType"

                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children"
                        onChange={(value) => setLine(value)}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {lines.map((item) => (
                          <Option key={item.code} value={item.code}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>

                      <Checkbox className="ml-5">Trẻ em không thẻ</Checkbox>
                    </Form.Item>

                  </Col>
                  <Col md={10}>
                    <Form.Item
                      name="area"
                      label="Khu vực"
                      rules={[
                        {
                          required: false,
                          message: "Vui lòng nhập tên danh mục",
                        },
                      ]}
                    >
                      <Select
                        name="area"

                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children"
                        onChange={(value) => setArea(value)}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {areas.map((item) => (
                          <Option key={item.code} value={item.code}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>



                    </Form.Item>
                  </Col>
                  <Col md={10}>
                    <Form.Item
                      name="formDTO"
                      label="Hình thức bảo hiểm"

                      rules={[
                        {
                          required: false,
                          message: "Vui lòng nhập tên danh mục",
                        },
                      ]}
                    >
                      {options.map((item, i) => {
                        return (
                          <div className="col-sm-12 px-3 py-2">
                            <Checkbox
                              key={i}
                              onChange={handleChangeType}
                              checked={item.value == valueType}
                              value={item.value}
                            >
                              {item.label}
                            </Checkbox>
                          </div>
                        );
                      })}


                    </Form.Item>
                  </Col>
                </Row>
                </>
              )}
            </Card>
          </Col>

          <Col span={24} className="mt-4">
            <Card title="Thông tin hành chính">
              {loading ? (
                <Spin />
              ) : (
                <>      <Row gutter={12}>

                  <Col md={10}>
                    <Form.Item
                      name="patientId"
                      label="Chọn bệnh nhân"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên danh mục",
                        },
                      ]}
                    >
                      <Select
                        name="patientId"

                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children"
                        onChange={(value) => OnchangePatientId(value)}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {patientItem.map((item) => (
                          <Option key={item.id} value={item.id}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  {
                    !isEdit && (

                      <>
                        <Col md={10}>
                          <Form.Item
                            label="Mã người bệnh"

                          >
                            <Input value={codepatient ? codepatient : 'Chưa cấp'} disabled />
                          </Form.Item>
                        </Col>
                        <Col md={10}>
                          <Form.Item

                            label="Năm sinh"
                          >
                            <Input value={numberPatient} disabled />
                          </Form.Item>


                        </Col>
                        <Col md={10}>
                          <Form.Item

                            label="Số BHYT"
                          >
                            <Input value={cardNumber ? cardNumber : "Không có"} disabled />
                          </Form.Item>
                        </Col>
                      </>


                    )
                  }


                </Row>
                </>
              )}
            </Card>
          </Col>
          <Col span={24} className="mt-4">
            <Card title="Thông tin khám bệnh">
              {loading ? (
                <Spin />
              ) : (
                <>      <Row gutter={12}>
                  <Col md={10}>
                    <Form.Item
                      name="trieuChung"
                      label="Triệu chứng bệnh"
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
                      name="benhChinh"
                      label="Bệnh chính"
                      rules={[
                        {
                          required: false,
                          message: "Vui lòng nhập nội dung",
                        },
                      ]}
                    >
                      <Select
                        name="benhChinh"
                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children"
                        onChange={(value) => setDisease(value)}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {diseases.map((item) => (
                          <Option key={item.code} value={item.code}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col md={10}>
                    <Form.Item
                      name="dienGiaiBenhChinh"
                      label="Diễn giải bệnh chính"
                      rules={[
                        {
                          required: false,
                          message: "Vui lòng nhập nội dung",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={10}>
                    <Form.Item
                      name="benhKemTheo"
                      label="Bệnh kèm theo"
                      rules={[
                        {
                          required: false,
                          message: "Vui lòng nhập nội dung",
                        },
                      ]}
                    >
                      <Select
                        name="benhKemTheo"

                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children"
                        onChange={(value) => setIncludeDisease(value)}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {Includediseases.map((item) => (
                          <Option key={item.code} value={item.code}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col md={10}>
                    <Form.Item
                      name="dienGiaiBenhKemTheo"
                      label="Diễn giải bệnh kèo theo"
                      rules={[
                        {
                          required: false,
                          message: "Vui lòng nhập nội dung",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col md={10}>
                    <Form.Item
                      name="tuVanDieuTri"
                      label="Tư vấn điều trị"
                      rules={[
                        {
                          required: false,
                          message: "Vui lòng nhập nội dung",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={10}>
                    <Form.Item
                      name="dienBienDieuTri"
                      label="Diễn biến điều trị"
                      rules={[
                        {
                          required: false,
                          message: "Vui lòng nhập nội dung",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={10}>
                    <Form.Item
                      name="ketQuaKham"
                      label="Kết quá khám"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên danh mục",
                        },
                      ]}
                    >
                      <Select
                        name="ketQuaKham"

                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children"
                        onChange={(value) => setResult(value)}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {results.map((item) => (
                          <Option key={item.code} value={item.code}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>


                  <Col md={10}>
                    {
                      !isEdit && (
                        <Form.Item
                          name="dateStartString"
                          label="Ngày khám"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập nội dung",
                            },
                          ]}
                        >
                          <Calendar placeholder="Chọn ngày" />
                        </Form.Item>
                      )
                    }

                    {
                      isEdit && (
                        <Form.Item
                          name="dateStart"
                          label="Ngày bắt đầu khám"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập nội dung",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      )
                    }
                  </Col>

                  <Col md={10}>

                    {
                      !isEdit && (
                        <Form.Item
                          name="dateEndString"
                          label="Ngày kết thúc khám"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập nội dung",
                            },
                          ]}
                        >
                          <Calendar placeholder="Chọn ngày" />
                        </Form.Item>
                      )
                    }

                    {
                      isEdit && (
                        <Form.Item
                          name="dateEnd"
                          label="Ngày kết thúc khám"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập nội dung",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      )
                    }
                  </Col>
                  <Col md={10}>
                    <Form.Item
                      name="userId"
                      label="Bác sĩ khám"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên danh mục",
                        },
                      ]}
                    >
                      <Select
                        name="userId "

                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children"
                        onChange={(value) => setDepartmentType(value)}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {userItem.map((item) => (
                          <Option key={item.id} value={item.id}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  {!isEdit && (
                    <Col md={10}>

                      <Form.Item

                        label="Nhóm dịch vụ"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên danh mục",
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          style={{ width: 200 }}
                          optionFilterProp="children"
                          onChange={(value) => loadDataProduct(value)}
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {categoryItem.map((item) => (
                            <Option key={item.id} value={item.id}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>

                    </Col>
                  )
                  }
                  <Col md={10}>
                    <Form.Item
                      name="productId"
                      label="Dịch vụ"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên danh mục",
                        },
                      ]}
                    >
                      <Select
                        name="productId"
                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children"

                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {product && product.items.length > 0 && product.items.map((item) => (
                          <Option key={item.id} value={item.id}>
                            {item.nameVi}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  {/* <Col md={10}>
                    <Form.Item
                      name="roomType"
                      label="Loại phòng ban"
                      rules={[
                        {
                          required: true,
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
                  </Col> */}

                </Row>
                </>
              )}
            </Card>
          </Col>

          <Col span={24} className="mt-4">
            {
              !isEdit && (
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
                              title: "Đường dùng",
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
                              title: "Số lượng",
                              render: (text, record) =>
                                <InputNumber min={1} max={10000} defaultValue={1} onChange={onChangeNumber} />
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
                              title: "STT",
                              dataIndex: "drugId",
                            },
                            {
                              title: "Giá",
                              dataIndex: "price",
                              render: (price) => formatMoney(price) + " VNĐ"
                            },
                            {
                              title: "Số lượng",
                              dataIndex: "quantity",
                              render: (quantity) => quantity
                            },
                            {
                              title: "Thành tièn",
                              dataIndex: "amout",
                              render: (amout) => formatMoney(amout) + " VNĐ"
                            },

                          ]}
                          loading={loading}

                        ></Table>
                      )}
                      <h2 className="font-bold mt-3">Tổng cộng  {formatMoney(totalAmount) + " VNĐ" } </h2> 
                    </Col>



                  </Row>


                </Card>
              )
            }

            {
              isEdit && (
                <Card title="Danh sách thuốc">
                  <Row gutter={12}>
                    <Col md={12}>
                      {loading ? (
                        <Spin />
                      ) : (
                        <Form.Item
                          name="listDrugs"
                        >
                          <Table

                            dataSource={detailsDrugs}
                            pagination={false}
                            columns={[
                              {
                                title: "STT",
                                dataIndex: "id",
                              },
                              {
                                title: "Tên thuốc",
                                dataIndex: "drug",
                                render: (drug) => drug.name,
                              },

                              {
                                title: "Công dụng",
                                dataIndex: "drug",
                                render: (drug) => drug.congDung,
                              },


                              {
                                title: "Giá",
                                dataIndex: "price",
                              },
                              {
                                title: "Số lượng",
                                dataIndex: "quantity",
                                render: (quantity) => quantity
                              },

                            ]}
                            loading={loading}

                          ></Table>
                        </Form.Item>

                      )}
                      Tổng cộng  {totalAmount ? totalAmount : "10000"}
                    </Col>
                  </Row>


                </Card>
              )
            }

          </Col>
          {
            !isEdit && (<Col span={8} className="mt-4">
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
            </Col>)
          }

        </Row>

      </Form>
    </div>
  );
};
export default CreateRole;
