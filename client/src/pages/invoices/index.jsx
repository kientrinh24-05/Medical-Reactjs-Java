import {
    PageHeader,
    Card,
    Table,
    Button,
    Space,
    Popconfirm,
    Spin,
    Input,
    message
} from "antd";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import CreateRole from "./create-edit";
import { userCan } from "@/_state";
import { useRecoilValue } from "recoil";
import { invoicesAtom } from "@/_state";
import { useInvoicesActions } from "@/_actions";
import { useDebounce } from "@/lib/hook";

export const convertTypeToInt = (applyFor) => {
    switch (applyFor) {
        case "kpi":
            return 1;
        default:
            return undefined;
    }
};

const InvoicesPage = ({ ...props }) => {
    const { pathname } = useLocation();
    //chuyển path /kpi /ccf thành giá trị enum
    const applyFor = pathname.replace("/department/", "");
    const type = convertTypeToInt(applyFor)

    const actions = useInvoicesActions();
    const navigate = useNavigate();

    const canCreate = useRecoilValue(userCan("department.create"));
    const canDelete = useRecoilValue(userCan("department.delete"));
    const canEdit = useRecoilValue(userCan("department.update"));

    const [showCreate, setShowCreate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingRow, setLoadingRow] = useState(null);
    const deparment = useRecoilValue(invoicesAtom);

    const [filter, setFilter] = useState();
    const handleFilter = (name, value) => {
        setFilter({ ...filter, [name]: value });
    };

    const [search, setSearch] = useState(null);
    const debouncedSearchQuery = useDebounce(search, 600);
    useEffect(() => {
        setFilter({ ...filter, search });
    }, [debouncedSearchQuery]);

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: deparment.total,
    });

    console.log(pagination, 'pagination');

    const handleTableChange = (pagination, filters, sorter) => {
        setPagination(pagination);
    };

    const loadData = async () => {
        setLoading(true);
        await actions.getList({
            pageNumber: 1,
            pageSize: 1000,
        });

        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [filter]);

    useEffect(() => {
        setPagination({
            ...pagination,
            total: deparment.total,
        });
    }, [deparment]);

    const invoicecomplete = async (id) => {
        setLoadingRow(id);
        await actions.invoiceComplete({ ids: [id] });
        message.success("Đã thanh toán thành công")
        setLoadingRow(null);
    };

    const invoicecancel = async (id) => {
        setLoadingRow(id);
        await actions.invoiceCancel({ ids: [id] });
        message.success("Đã hủy đơn thành công")
        setLoadingRow(null);
    };

    var invoicesType = {
        0: '<span class="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">Đang chờ</span>',
        1: ' <span class="bg-pink-100 text-pink-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-pink-200 dark:text-pink-900">Hủy đơn</span>',
        2: 'Đã thanh toán',
    }


    return (
        <div>
            <PageHeader
                title={"Danh mục hóa đơn dịch vụ"}
                // extra={
                //     !canCreate && (
                //         <Button
                //             onClick={() => navigate("/department/create")}
                //             size="large"
                //             className="bg-blue-500 text-white"
                //         >
                //             Thêm hóa đơn
                //         </Button>
                //     )
                // }
            />
            <Space style={{ marginBottom: 16 }}>
                {/* <Input
                    placeholder="Tìm kiếm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                /> */}
            </Space>
            <Card>
                <Table
                    dataSource={deparment.items}
                    
                    columns={[
                        {
                            title: "STT",
                            dataIndex: "id",
                        },
                        {
                            title: "Tên bệnh nhân",
                            dataIndex: "patient",
                            render: (patient) => patient.name,
                            key: "patient"
                        },
                        {
                            title: "Số BHYT",
                            dataIndex: "numberBHYT",
                        },
                        {
                            title: "Dịch vụ",
                            dataIndex: "product",
                            render: (product) => product.nameVi,
                            key: "product"
                        },
                        {
                            title: "Giá dịch vụ",
                            dataIndex: "product",
                            render: (product) => product.price,
                            key: "product"
                        },

                        {
                            title: "Tổng tiền",
                            dataIndex: "totalAmount",
                        },
                        {
                            title: "Trạng thái thanh toán",
                            dataIndex: "type",
                            // render: (text, record) => (
                            //     <>
                            //         {
                            //             invoicesType[text]
                            //         }
                            //     </>
                            // ),
                            render: (text, record) => (
                                <>


                                    {record.type == 2 ? (
                                        <span class="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">Đã thanh toán</span>
                                    ) : record.type == 1 ? (
                                        <span class="bg-pink-100 text-pink-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-pink-200 dark:text-pink-900">Huỷ đơn</span>
                                    ) :
                                        (
                                            <span class="bg-orange-100 text-orange-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-orange-200 dark:text-orange-900">Đang thanh toán</span>
                                        )
                                    }
                                </>
                            ),
                        },
                        // {
                        //     title: "Trạng thái",
                        //     dataIndex: "description",
                        //     render: (text, record) => (
                        //         <>
                        //           {record.status == 1 ? (
                        //             <span class="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">Đang hoạt động</span>
                        //           ) : (
                        //             <span class="bg-pink-100 text-pink-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-pink-200 dark:text-pink-900">Ngưng hoạt động</span>
                        //           )}
                        //         </>
                        //     ),
                        // },
                        {
                            title: "Hành động",
                            width: 150,
                            render: (_, record) => (
                                <div className="text-center">
                                    {loadingRow == record.id ? (
                                        <Spin />
                                    ) : (
                                        <Space size="middle">

                                            {!canDelete && (
                                                
                                                    <Button 

                                                    onClick={() =>
                                                        navigate(
                                                            "/medical_examination/create/edit/" +
                                                                record.id
                                                        )
                                                    }
                                                    type="primary" size="small">
                                                    Xem chi tiết
                                                </Button>
                                            )}
                                            {!canDelete && (
                                                
                                                <Popconfirm
                                                    title="Bạn chắc chắn thanh toán chứ?"
                                                    onConfirm={() =>
                                                        invoicecomplete(record.id)
                                                    }
                                                >

                                                    <Button
                                                type="primary" size="small">
                                                Thanh toán
                                                </Button>
                                                </Popconfirm>

                                                
                                            )}
                                            {!canEdit && (
                                                <Popconfirm
                                                    title="Bạn chắc chắn hủy đơn chứ?"
                                                    onConfirm={() =>
                                                        invoicecancel(record.id)
                                                    }
                                                >   
                                                  <Button
                                                type="secondary" size="small">
                                                    Hủy đơn
                                                </Button>
                                    
                                                </Popconfirm>
                                            )}
                                        </Space>
                                    )}
                                </div>
                            ),
                        },
                    ]}
                    loading={loading}
                    footer={() => `Tổng số danh mục ${pagination.total}`}
                    onChange={handleTableChange}
                ></Table>
            </Card>
            {showCreate && (
                <CreateRole show onClose={() => setShowCreate(false)} />
            )}
        </div>
    );
};

export default InvoicesPage;
