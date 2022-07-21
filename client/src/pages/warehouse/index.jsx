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
import { warehouseAtom } from "@/_state";
import { useWareHouseActions } from "@/_actions";
import { useDebounce } from "@/lib/hook";

export const convertTypeToInt = (applyFor) => {
    switch (applyFor) {
        case "kpi":
            return 1;
        default:
            return undefined;
    }
};

const WareHousePage = ({ ...props }) => {
    const { pathname } = useLocation();
    //chuyển path /kpi /ccf thành giá trị enum
    const applyFor = pathname.replace("/warehouse/", "");
    const type = convertTypeToInt(applyFor)

    const actions = useWareHouseActions();
    const navigate = useNavigate();

    const canCreate = useRecoilValue(userCan("warehouse.create"));
    const canDelete = useRecoilValue(userCan("warehouse.delete"));
    const canEdit = useRecoilValue(userCan("warehouse.update"));

    const [showCreate, setShowCreate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingRow, setLoadingRow] = useState(null);
    const warehouse = useRecoilValue(warehouseAtom);

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
        total: warehouse.total,
    });

    const handleTableChange = (pagination, filters, sorter) => {
        setPagination(pagination);
    };

    var warehouseType = {
        0: 'Kho chẵn',
        1: 'Kho cơ số',
        2: 'Kho lẻ',
        3: 'Quầy thuốc',
    }

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
            total: warehouse.total,
        });
    }, [warehouse]);

    const remove = async (id) => {
        setLoadingRow(id);
        await actions.destroy(id);
        setLoadingRow(null);
    };

    return (
        <div>
            <PageHeader
                title={"Danh mục kho dược"}
                extra={
                    !canCreate && (
                        <Button
                            onClick={() => navigate("/warehouse/create")}
                            size="large"
                            className="bg-blue-500 text-white"
                        >
                            Thêm dịch vụ
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
                    dataSource={warehouse.items}
                    columns={[
                        {
                            title: "STT",
                            dataIndex: "id",
                        },
                        {
                            title: "Mã kho",
                            dataIndex: "code",
                        },
                        {
                            title: "Tên kho",
                            dataIndex: "name",
                            sorter: true
                        },
                        {
                            title: "Loại kho",
                            dataIndex: "type",
                            render: (text, record) => (
                                <>
                                    {
                                        warehouseType[text]
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
                                                            "/warehouse/edit/" +
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

export default WareHousePage;
