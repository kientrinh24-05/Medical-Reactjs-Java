import {
    PageHeader,
    Card,
    Table,
    Button,
    Modal,
    Space,
    Popconfirm,
    Spin,
} from "antd";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import CreateRole from "./create-edit";
import { userCan } from "@/_state";
import { useRecoilValue } from "recoil";
import { administrativeAtom } from "@/_state";
import { useAdministrativeActions } from "@/_actions";

const DepartmentPage = ({ ...props }) => {
    const actions = useAdministrativeActions();
    const navigate = useNavigate();
    const [showCreate, setShowCreate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingRow, setLoadingRow] = useState(null);
    const administrative = useRecoilValue(administrativeAtom);

    const canCreate = useRecoilValue(userCan("administrative.create"));
    const canDelete = useRecoilValue(userCan("administrative.delete"));
    const canEdit = useRecoilValue(userCan("administrative.update"));

    const loadData = async () => {
        setLoading(true);
        await actions.getList();
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const remove = async (id) => {
        setLoadingRow(id);
        await actions.destroy({ids:[id]});
        setLoadingRow(null);
    };

    const countryType = {
        0: 'Tỉnh/TP',
        1: 'Quận/Huyện',
        2: 'Xã/Phường',
        3: 'Thôn/Xóm',
    }
    return (
        <div>
            <PageHeader
                title={"Quản lý đơn vị hành chính"}
                extra={
                    !canCreate && (
                        <Button
                            onClick={() => navigate("/administrative/create")}
                            size="large"
                            className="bg-blue-500 text-white"
                        >
                            Thêm đơn vị hành chính
                        </Button>
                    )
                }
            />
            <Card>
                <Table
                    dataSource={administrative.items}
                    columns={[

                        {
                            title: "Mã",
                            dataIndex: "code",
                        },
                        {
                            title: "Tên",
                            dataIndex: "name",
                        },
                        {
                            title: "Tên viết tắt",
                            dataIndex: "shortName",

                        },
                        {
                            title: "Cấp",
                            dataIndex: "type",
                            render: (text, record) => (
                                <>
                                    {
                                        countryType[text]
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
                                                            "/administrative/edit/" +
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
                ></Table>
            </Card>
            {showCreate && (
                <CreateRole show onClose={() => setShowCreate(false)} />
            )}
        </div>
    );
};

export default DepartmentPage;
