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
import { warehousedrugAtom } from "@/_state";
import { useWareHouseDrugActions } from "@/_actions";
import { useDebounce } from "@/lib/hook";

export const convertTypeToInt = (applyFor) => {
    switch (applyFor) {
        case "kpi":
            return 1;
        default:
            return undefined;
    }
};

const WareHouseDrug = ({ ...props }) => {
    const { pathname } = useLocation();
    //chuyển path /kpi /ccf thành giá trị enum
    const applyFor = pathname.replace("/department/", "");
    const type = convertTypeToInt(applyFor)

    const actions = useWareHouseDrugActions();
    const navigate = useNavigate();

    const canCreate = useRecoilValue(userCan("department.create"));

    const [showCreate, setShowCreate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingRow, setLoadingRow] = useState(null);
    const deparment = useRecoilValue(warehousedrugAtom);

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
            pageNumber: 1,
            pageSize: 1000
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


    return (
        <div>
            <PageHeader
                title={"Danh mục kho thuốc"}
                extra={
                    !canCreate && (
                        <Button
                            onClick={() => navigate("/warehouse_drug/create")}
                            size="large"
                            className="bg-blue-500 text-white"
                        >
                            Điều chỉnh tồn kho
                        </Button>
                    )
                }
            />
            <Card>
                <Table
                    dataSource={deparment.items}
                    columns={[
                        {
                            title: "STT",
                            dataIndex: "id",
                        },
                        {
                            title: "Tên kho",
                            dataIndex: "wareHouse",
                            render: (wareHouse) => wareHouse.name,
                        },
                        {
                            title: "Tên Thuốc",
                            dataIndex: "drug",
                            render: (drug) => drug.name,
                        },

                        {
                            title: "Số lượng còn lại",
                            dataIndex: "quantity",
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

export default WareHouseDrug;
