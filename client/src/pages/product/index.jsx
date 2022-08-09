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
import { productAtom } from "@/_state";
import { useProductActions } from "@/_actions";
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

const ProductPage = ({ ...props }) => {
    const { pathname } = useLocation();
    //chuyển path /kpi /ccf thành giá trị enum
    const applyFor = pathname.replace("/product/", "");
    const type = convertTypeToInt(applyFor)

    const actions = useProductActions();
    const navigate = useNavigate();

    const canCreate = useRecoilValue(userCan("product.create"));
    const canDelete = useRecoilValue(userCan("product.delete"));
    const canEdit = useRecoilValue(userCan("product.update"));

    const [showCreate, setShowCreate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingRow, setLoadingRow] = useState(null);
    const deparment = useRecoilValue(productAtom);

    console.log(deparment , 'deparment');

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

    var product = {
        1: 'Phòng bệnh',
        2: 'Phòng khám / ngoại trú',
        3: 'Điều trị nội trú',
        4: 'Khoa xét nghiệm',
        5: 'Khoa chẩn đoán hình ảnh'
    }
 

    return (
        <div>
            <PageHeader
                title={"Danh mục dịch vụ"}
                extra={
                    !canCreate && (
                        <Button
                            onClick={() => navigate("/product/create")}
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
                    dataSource={deparment.items}
                    columns={[
                        {
                            title: "STT",
                            dataIndex: "id",
                        },
                        {
                            title: "Mã dịch vụ",
                            dataIndex: "code",
                        },
                        {
                            title: "Tên dịch vụ",
                            dataIndex: "nameVi",
                        },
                        {
                            title: "Giá Tiền",
                            dataIndex: "price",
                            render: (price) => formatMoney(price) + ' VNĐ'
                        },
                        {
                            title: "Giá BHYT",
                            dataIndex: "priceBHYT",
                            render: (priceBHYT) => formatMoney(priceBHYT) + ' VNĐ'
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
                                                            "/product/edit/" +
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

export default ProductPage;
