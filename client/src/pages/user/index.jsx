import {
    PageHeader,
    Card,
    Table,
    Button,
    Modal,
    Space,
    Popconfirm,
    Spin,
    message
} from "antd";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import Create from "./create-edit";
import ResetPass from "./reset-pass";
import { userCan } from "@/_state";
import { useRecoilValue } from "recoil";
import { usersAtom } from "@/_state";
import { useUserActions } from "@/_actions";
import { gender } from "../../utils/enum";
import moment from 'moment';

const UserPage = ({ ...props }) => {
    const userAction = useUserActions();
    const navigate = useNavigate();
    const [showReset, setShowReset] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingRow, setLoadingRow] = useState(null);
    const users = useRecoilValue(usersAtom);

    const canCreate = useRecoilValue(userCan("user.create"));
    const canDelete = useRecoilValue(userCan("user.delete"));
    const canEdit = useRecoilValue(userCan("user.update"));
    const canResetPass = useRecoilValue(userCan("user.reset-password"));

    const loadData = async () => {
        setLoading(true);
        await userAction.getList({
            pageNumber:1,
            pageSize:1000,
            searchKey:"",
            sortCase:1,
            status:1,
        });
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const remove = async (id) => {
        setLoadingRow(id);
        await userAction.destroy({ids:[id]});
        message.success("Đã xóa thành công");
        setLoadingRow(null);
    };
    return (
        <div>
            <PageHeader
                title={"Quản lý người dùng"}
                extra={
                    !canCreate && (
                        <Button
                            onClick={() => navigate("/user/create")}
                            size="large"
                            className="bg-blue-500 text-white"
                        >
                            Thêm người dùng
                        </Button>
                    )
                }
            />
            <Card>
                <Table
                    dataSource={users.items}
                    columns={[
                        {
                            title: "STT",
                            dataIndex: "id",
    
                        },
                        {
                            title: "Tài khoản",
                            dataIndex: "username",
    
                        },
                        {
                            title: "Điện thoại",
                            dataIndex: "phone",
                        },
                        {
                            title: "Email",
                            dataIndex: "email",

                        },
                        {
                            title: "Ngày sinh",
                            dataIndex: "birthDay",
                            render: (text, record) => (
                                <>
                                  {moment(text).format("DD/MM/yyyy") ? moment(text).format("DD/MM/yyyy") : 'No birdth day'}
                                </>
                              ),
                        },
                        {
                            title: "Giới tính",
                            dataIndex: "gender",
                            render: (_,record) => {
                                return record.gender == 1
                                    ? "Nam"
                                    : "Nữ";
                            },
                        },
                        {
                            title: "Trạng thái",
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
                                                            "/user/edit/" +
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
                    footer={() => `Tổng số danh mục ${users.items.length}`}
                ></Table>
            </Card>
            <ResetPass
                show={!!showReset}
                model={showReset}
                onRequestClose={() => setShowReset(false)}
            />
        </div>
    );
};

export default UserPage;
