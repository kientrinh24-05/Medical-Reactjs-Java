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
import { departmentAtom } from "@/_state";
import { useDepartmentActions } from "@/_actions";
import { useDebounce } from "@/lib/hook";

export const convertTypeToInt = (applyFor) => {
    switch (applyFor) {
        case "kpi":
            return 1;
        default:
            return undefined;
    }
};

const DepartmentPage = ({ ...props }) => {
    const { pathname } = useLocation();
    //chuyển path /kpi /ccf thành giá trị enum
    const applyFor = pathname.replace("/department/", "");
    const type = convertTypeToInt(applyFor)

    const actions = useDepartmentActions();
    const navigate = useNavigate();

    const canCreate = useRecoilValue(userCan("department.create"));
    const canDelete = useRecoilValue(userCan("department.delete"));
    const canEdit = useRecoilValue(userCan("department.update"));

    const [showCreate, setShowCreate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingRow, setLoadingRow] = useState(null);
    const deparment = useRecoilValue(departmentAtom);

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

    console.log(pagination , 'pagination');

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

    var department = {
        1: 'Phòng bệnh',
        2: 'Phòng khám / ngoại trú',
        3: 'Điều trị nội trú',
        4: 'Khoa xét nghiệm',
        5: 'Khoa chẩn đoán hình ảnh'
    }
    
    var number = {
        1: 'Khoa sản',
        2: 'Khoa tai mũi họng',
        3: 'Khoa răng hàm mặt',
        4: 'Khoa da liễu',
    }
 

    return (
        <div>
            <PageHeader
                title={"Danh mục phòng ban"}
                extra={
                    !canCreate && (
                        <Button
                            onClick={() => navigate("/department/create")}
                            size="large"
                            className="bg-blue-500 text-white"
                        >
                            Thêm phòng ban
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
                            title: "Mã",
                            dataIndex: "code",
                        },
                        {
                            title: "Tên",
                            dataIndex: "name",
                        },
                        {
                            title: "Khoa",
                            dataIndex: "khoa",
                            render: (text, record) => (
                                <>
                                    {
                                        number[text]
                                    }
                                </>
                            ),  
                        },
                        {
                            title: "Cấp",
                            dataIndex: "level",
                        },
                        {
                            title: "Loại phòng",
                            dataIndex: "roomType",
                            render: (text, record) => (
                                <>
                                    {
                                        department[text]
                                    }
                                </>
                            ),
                        },
                        {
                            title: "Trạng thái",
                            dataIndex: "description",
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
                                                            "/department/edit/" +
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

export default DepartmentPage;
