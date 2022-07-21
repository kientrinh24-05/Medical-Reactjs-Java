import {
    PageHeader,
    Card,
    Table,
    Button,
    Space,
    Popconfirm,
    Spin,
    Input,
} from "antd";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import CreateRole from "./create-edit";
import { userCan } from "@/_state";
import { useRecoilValue } from "recoil";
// import { supplierAtom } from "@/_state";
import { supplierAtom } from "@/_state";
import { useSuppliertActions } from "@/_actions";
import { useDebounce } from "@/lib/hook";

export const convertTypeToInt = (applyFor) => {
    switch (applyFor) {
        case "kpi":
            return 1;
        default:
            return undefined;
    }
};

const SupplierPage = ({ ...props }) => {
    const { pathname } = useLocation();
    //chuyển path /kpi /ccf thành giá trị enum
    const applyFor = pathname.replace("/supplier/", "");
    const type = convertTypeToInt(applyFor)

    const actions = useSuppliertActions();
    const navigate = useNavigate();

    const canCreate = useRecoilValue(userCan("supplier.create"));
    const canDelete = useRecoilValue(userCan("supplier.delete"));
    const canEdit = useRecoilValue(userCan("supplier.update"));

    const [showCreate, setShowCreate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingRow, setLoadingRow] = useState(null);
    const supplier = useRecoilValue(supplierAtom);

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
        total: supplier.total,
    });

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
            total: supplier.total,
        });
    }, [supplier]);

    const remove = async (id) => {
        setLoadingRow(id);
        await actions.destroy({ids:[id]});
        setLoadingRow(null);
    };

    var compannyType = {
        1: 'Trong nước',
        2: 'Ngoài nước',
    }

    return (
        <div>
            <PageHeader
                title={"Danh mục nhà cung cấp"}
                extra={
                    !canCreate && (
                        <Button
                            onClick={() => navigate("/supplier/create")}
                            size="large"
                            className="bg-blue-500 text-white"
                        >
                            Thêm nhà cung cấp
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
                    dataSource={supplier.items}
                    columns={[
                        {
                            title: "STT",
                            dataIndex: "id",
                        },
                        {
                            title: "Mã nhà cung cấp",
                            dataIndex: "code",
                            width:"200px",
                        },
                        {
                            title: "Tên nhà cung cấp",
                            dataIndex: "name",
                            width:"200px",
                            sorter: true
                        },
                        {
                            title: "Địa chỉ",
                            dataIndex: "address",
                        },
                        {
                            title: "Điện thoại",
                            dataIndex: "phone",
                        },
                        {
                            title: "MST",
                            dataIndex: "mst",
                        },
                        {
                            title: "Loại hình công ty",
                            dataIndex: "type",
                             render: (text, record) => (
                                <>
                                    {
                                        compannyType[text]
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
                                                            "/supplier/edit/" +
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
                    footer={() => `Tổng số danh mục 10`}
                    onChange={handleTableChange}
                ></Table>
            </Card>
            {showCreate && (
                <CreateRole show onClose={() => setShowCreate(false)} />
            )}
        </div>
    );
};

export default SupplierPage;
