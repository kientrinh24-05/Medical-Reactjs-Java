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
  import { patientAtom, usersAtom } from "@/_state";
  import { useDepartmentActions, useInvoicesActions, usePrugsActions, usePatienttActions, useProductActions, useUserActions, useCategoryActions } from "@/_actions";
  import { useParams } from "react-router-dom";
  import { useRecoilValue } from "recoil";
  import { userCan, categoryAtom, productAtom, drugsAtom } from "@/_state";
  import { convertTypeToInt } from "../medical_examination/index";
  import Calendar from "../../components/calendar";
  import moment from "moment";
import { formatMoney } from "../../utils/helper";
  
  const CheckboxGroup = Checkbox.Group;
  
  const InvoicesMedical = ({idEdit , handleClose}) => {

    console.log(idEdit , 'idEdit');
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
  
    const actions = useInvoicesActions();
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
    }, [details])
   
  
    const pushData = (record) => {
  
    
      const index = details.map(item => item.drugId).indexOf(record.id);
  
      if (index !== -1) {
        const newDetails = [...details];
        newDetails[index].quantity++;
        setDetails(newDetails);
      } else {
        const newDetails = [...details];
        newDetails.push(
          {
            amout: record.name,
            drugId: record.id,
            price: record.price ? record.price : 10000,
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

    const invoicecomplete = async (id) => {
      await actionsInvoces.invoiceComplete({ ids: [id] });
      message.success("Đã thanh toán thành công");
  };
  
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
    const [nameProduct, setnameProduct] = useState("");
    const [dateCreate, setdateCreate] = useState("");
    const [loading, setLoading] = useState(false);
  
    const loadDetail = async () => {
      setLoading(true);
      const { data } = await actionsInvoces.show(idEdit);
  
      console.log(data.data ,'data');
      form.setFieldsValue({
        objectType: data.data.objectType,
        numberBHYT: data.data.numberBHYT,
        fromDate: moment(data.data.fromDate).format("DD-MM-YYYY HH:mm:ss")  ,
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
      setnameProduct(data.data.product.nameVi);
      setdateCreate(data.data.fromDate);
  
      console.log(detailsDrugs ,'detailsDrugs');
  
      console.log(fromDateString , '123');
      setLoading(false);
    };
  
    useEffect(() => {
      loadDataPatient();
      if (idEdit) {
        console.log('Kane');
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



    const handleComplete = (id) => {
      invoicecomplete(idEdit);
    }
  
  
    const onSave = async () => {
  

      setTimeout(() => {
        handleClose();
      }, 1000);
      
      // try {
      //   const values = form.getFieldsValue();
      //   setSaveLoading(true);
      //   const data = {
      //     id,
      //     ...values,
      //     details,
      //     apply_for: type,
      //   };
      //   console.log(isEdit);
      //   if (isEdit) {
      //     await actionsInvoces.update(data);
      //   } else {
      //     await actionsInvoces.create(data);
      //     form.resetFields();
      //   }
      //   setSaveLoading(false);
  
      //   message.success(
      //     isEdit ? "Cập nhật dịch vụ thành công" : "Thêm mới dịch vụ thành công"
      //   );
      // } catch (error) {
      //   console.log(error);
      //   message.error(error.response.data.message);
      //   setSaveLoading(false);
      // }
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
                  {
                    idEdit && (
                      <>  
                        <div>
                        <div className="font-bold ">Dịch vụ đã sử dụng: <span className="ml-3 font-bold">{nameProduct} </span></div>
                        <div className="font-bold mb-4">Ngày sử dụng dịch vụ: <span className="ml-3 font-bold">{moment(dateCreate).format("DD-MM-YYYY HH:mm:ss")} </span></div>
                         
                        </div>
                        
                        <Card title="Danh sách thuốc">
                     
                     <Row gutter={12}>
                       <Col md={24}>
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
                                 render: (price) =>  formatMoney(price)+ ' VNĐ',
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
                            
                       </Col>
                      
                     </Row>

       
                    
                   </Card>

                   <h2 className="font-bold text-warning mt-4">  Tổng cộng  { formatMoney(totalAmount ? totalAmount : "10000") + ' VNĐ'}</h2> 
                      </>
                    
                    )
                  }
             
            </Col>

            <Col span={6} className="mt-6">
            
                <Space>
                  <Button
                    disabled={loading}
                    type="primary"
                    className="bg-slate-600 text-white"
                    htmlType="submit"
                    onClick={() => handleComplete(idEdit)}
                  >
                    Xác nhận
                  </Button>
                  <Button
                    type="default"
                    className="bg-red-500 text-white"
                    onClick={() => handleClose()}
                  >
                    Huỷ bỏ
                  </Button>
                </Space>

          </Col>
            
          </Row>
  
        </Form>
      </div>
    );
  };
  export default InvoicesMedical;
  