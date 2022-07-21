
import { List,Card } from "antd";


const NotificationIcon = ({ ...props }) => {
   

    return (
        <div className="w-72 px-4 bg-white" >
            <NoticeList
                list={[
                    { title: "test", description: "des" },
                    { title: "test", description: "des" },
                ]}
            />
        </div>
    );
};

export default NotificationIcon;

const NoticeList = ({ list = [], onClick }) => {
    if (!list || list.length === 0) {
        return (
            <div className="p-4">
                <div>{"Bạn hiện không có thông báo nào"}</div>
            </div>
        );
    }
    return (
        <div>
            <List
                className={"max-h-96 overflow-auto no-scrollbar"}
                dataSource={list}
                renderItem={(item, i) => {
                    return (
                        <List.Item
                            className={
                                "overflow-hidden cursor-pointer transition-all duration-300"
                            }
                            key={item.key || i}
                            onClick={() => {
                                onClick?.(item);
                            }}
                        >
                            <List.Item.Meta
                                className={"w-full"}
                                title={
                                    <div className={"mb-1"}>
                                        {item.title}
                                        <div
                                            className={
                                                "float-right -mt-0.5 mr-0"
                                            }
                                        >
                                            {item.extra}
                                        </div>
                                    </div>
                                }
                                description={
                                    <div>
                                        <div>{item.description}</div>
                                        <div className={"mt-1 text-sm"}>
                                            {item.datetime}
                                        </div>
                                    </div>
                                }
                            />
                        </List.Item>
                    );
                }}
            />
        </div>
    );
};
