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
import { patientAtom } from "@/_state";
import { usePatienttActions } from "@/_actions";
import { useDebounce } from "@/lib/hook";

export const convertTypeToInt = (applyFor) => {
    switch (applyFor) {
        case "kpi":
            return 1;
        default:
            return undefined;
    }
};

const PatientPage = ({ ...props }) => {
    const { pathname } = useLocation();
    //chuyển path /kpi /ccf thành giá trị enum
    const applyFor = pathname.replace("/patient/", "");
    const type = convertTypeToInt(applyFor)

    const actions = usePatienttActions();
    const navigate = useNavigate();

    const canCreate = useRecoilValue(userCan("patient.create"));
    const canDelete = useRecoilValue(userCan("patient.delete"));
    const canEdit = useRecoilValue(userCan("patient.update"));

    const [showCreate, setShowCreate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingRow, setLoadingRow] = useState(null);
    const deparment = useRecoilValue(patientAtom);

    const [filter, setFilter] = useState();
    const handleFilter = (name, value) => {
        setFilter({ ...filter, [name]: value });
    };

      const rowSelection = {
        onChange: (selectedRowKeys=[],selectedRows=[]) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
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

 
    return (
        <div>
            <PageHeader
                title={"Danh mục bệnh nhân"}
                extra={
                    !canCreate && (
                        <>
                        <Button
                            onClick={() => navigate("/patient/create")}
                            size="large"
                            className="bg-blue-500 text-white"
                        >
                            Thêm bệnh nhân
                        </Button>
                        </>
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
                    rowSelection={rowSelection}
                    columns={[
                        {
                            title: "STT",
                            dataIndex: "id",
                        },
                        {
                            title: "Mã phòng ban",
                            dataIndex: "code",
                        },
                        {
                            title: "Tên bệnh nhân",
                            dataIndex: "name",
                        },
                        {
                                title: "Giới tính",
                                dataIndex: "gender",
                                render: (text, record) => (
                                    <>
                                      {record.gender == 1 ? (
                                        "Nam"
                                      ) : (
                                        "Nữ"
                                      )}
                                    </>
                                ),
                        },
                        {
                            title: "Năm sinh",
                            dataIndex: "number",
                        },
                        {
                            title: "Đối tượng",
                            dataIndex: "objectType",
                        },
                        {
                            title: "Số BHYT",
                            dataIndex: "cardNumber",
                        },
                        {
                            title: "Trạng thái",
                            dataIndex: "isPaid",
                            render: (text, record) => (
                                <>
                                  {record.isPaid == 1 ? (
                                    <span class="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">Đã thanh toán</span>
                                  ) : (
                                    <span class="bg-pink-100 text-pink-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-pink-200 dark:text-pink-900">Chưa thanh toán</span>
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
                                                            "/patient/edit/" +
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

export default PatientPage;
