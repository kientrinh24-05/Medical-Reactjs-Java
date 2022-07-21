import { Card, Space, Table } from "antd";
import { useRecoilValue } from "recoil";
import { jobAtom } from "@/_state";

const Job = () => {
    const jobs = useRecoilValue(jobAtom);
    return (
        <Card className="fixed right-2 bottom-3" title="Danh sách yêu cầu">
            <Table
                dataSource={jobs}
                columns={[
                    { title: "Người yêu cầu", dataIndex: "name" },
                    {
                        title: "File cần tải",
                        dataIndex: "fileName",
                    },
                    {
                        title: "Hành động",
                        render: (_, record) => (
                            <Space size="middle">
                                <a
                                    className="text-blue-400"
                                >
                                    Chấp nhận
                                </a>

                                    <a className="text-red-500">Từ chối</a>
                            </Space>
                        ),
                    },
                ]}
            />
        </Card>
    );
};
export default Job;
