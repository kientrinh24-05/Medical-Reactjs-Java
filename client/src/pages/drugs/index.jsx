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
import { drugsAtom } from "@/_state";
import { usePrugsActions } from "@/_actions";
import { useDebounce } from "@/lib/hook";
import { formatMoney } from "../../utils/helper";

export const convertTypeToInt = (applyFor) => {
    switch (applyFor) {
        case "kpi":
            return 1;
        default:
            return undefined;
    }
};

const DrugsPage = ({ ...props }) => {
    const { pathname } = useLocation();
    //chuyển path /kpi /ccf thành giá trị enum
    const applyFor = pathname.replace("/drugs/", "");
    const type = convertTypeToInt(applyFor)

    const actions = usePrugsActions();
    const navigate = useNavigate();

    const canCreate = useRecoilValue(userCan("drugs.create"));
    const canDelete = useRecoilValue(userCan("drugs.delete"));
    const canEdit = useRecoilValue(userCan("drugs.update"));

    const [showCreate, setShowCreate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingRow, setLoadingRow] = useState(null);
    const deparment = useRecoilValue(drugsAtom);

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

    console.log(deparment.items.length , 'deparment.items');

    const handleTableChange = (pagination, filters, sorter) => {
        setPagination(pagination);
    };

    const loadData = async () => {
        setLoading(true);
        await actions.getList({
            ...filter,
            type,
            page: pagination.current,
            pageSize: pagination.pageSize,
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

    const remove = async (id) => {
        setLoadingRow(id);
        await actions.destroy({ids:[id]});
        message.success("Đã xóa thành công")
        setLoadingRow(null);
    };

    var drugs = {
        1: 'Phòng bệnh',
        2: 'Phòng khám / ngoại trú',
        3: 'Điều trị nội trú',
        4: 'Khoa xét nghiệm',
        5: 'Khoa chẩn đoán hình ảnh'
    }

    var typeMaterial = {
        1: 'Bơm kim tiêm',
        2: 'Dung môi',
        3: 'Hóa chất XN',
        4: 'Hộp an toàn',
        5: 'Thuốc',
        6: 'Vắc xin',
        7: 'Vật tư y tế'
    }

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
                title={"Danh mục thuốc"}
                extra={
                    !canCreate && (
                        <Button
                            onClick={() => navigate("/drugs/create")}
                            size="large"
                            className="bg-blue-500 text-white"
                        >
                            Thêm Thuốc
                        </Button>
                    )
                }
            />
            <Space style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Tìm kiếm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
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
                            title: "Mã dược",
                            dataIndex: "code",
                        },
                        {
                            title: "Tên thuốc",
                            dataIndex: "name",
                        },

                        {
                            title: "Giá thuốc",
                            dataIndex: "price",
                            render:(price) => formatMoney(price)+ ' VNĐ'
                        },
                        {
                            title: "Đơn vị tính",
                            dataIndex: "donViTinh",
                            render: (text, record) => (
                                <>
                                    {
                                        unitDrugs[text]
                                    }
                                </>
                            ),
                        },
                        {
                            title: "Số đăng ký",
                            dataIndex: "soDangKy",
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
                            title: "Trạng thái",
                            dataIndex: "status",
                            render: (text, record) => (
                                <>
                                  {record.status == 1 ? (
                                    <span class="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">Đang hoạt động</span>
                                  ) : (
                                    <span class="bg-pink-100 text-pink-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-pink-200 dark:text-pink-900">Ngưng hoạt động</span>
                                  )}
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
                                            {!canDelete && (
                                                <a
                                                    className="text-blue-400"
                                                    onClick={() =>
                                                        navigate(
                                                            "/drugs/edit/" +
                                                                record.id
                                                        )
                                                    }
                                                >
                                                    Cập nhật
                                                </a>
                                            )}
                                            {!canEdit && (
                                                <Popconfirm
                                                    title="Bạn chắc chắn chứ?"
                                                    onConfirm={() =>
                                                        remove(record.id)
                                                    }
                                                >
                                                    <a className="text-red-500">
                                                        Xoá
                                                    </a>
                                                </Popconfirm>
                                            )}
                                        </Space>
                                    )}
                                </div>
                            ),
                        },
                    ]}
                    loading={loading}
                    footer={() => `Tổng số danh mục ${deparment.items.length}`}
                    onChange={handleTableChange}
                ></Table>
            </Card>
            {showCreate && (
                <CreateRole show onClose={() => setShowCreate(false)} />
            )}
        </div>
    );
};

export default DrugsPage;
