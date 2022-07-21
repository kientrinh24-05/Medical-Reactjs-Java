import {
    Modal,
    Upload,
    message,
    Image,
    Row,
    Col,
    Popover,
    Checkbox,
    Spin,
    Progress,
    Tree,
    Button,
    Form,
    Input,
    Popconfirm,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useWindowDimensions } from "@/lib/hook";
import styled from "styled-components";
import { useState, useEffect, useCallback } from "react";
const { Dragger } = Upload;
import { useAttachmentActions } from "@/_actions";
import { attachmentsAtom, attachmentCategoryNested } from "@/_state";
import { useRecoilValue } from "recoil";
import { Scrollbars } from "react-custom-scrollbars";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const { DirectoryTree } = Tree;

const FileManager = ({
    show,
    onRequestClose,
    onSelectFile,
    options = {
        multiple: true,
    },
    ...props
}) => {
    const { width } = useWindowDimensions();
    const attachmentActions = useAttachmentActions();
    const [loading, setLoading] = useState(false);
    const [selecteds, setSelecteds] = useState([]);
    const [uploading, setUploading] = useState({});
    const [deletings, setDeletings] = useState([]);
    const attachment = useRecoilValue(attachmentsAtom);
    const folders = useRecoilValue(attachmentCategoryNested);

    const [showAddFolder, setShowAddFolder] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [editFolder, setEditFolder] = useState(null);

    const { multiple, folder } = options;

    const loadData = async () => {
        setLoading(true);
        await axios.all([
            attachmentActions.getList(),
            attachmentActions.getFolderList(),
        ]);

        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const onSelectImage = (file) => {
        if (selecteds.includes(file.id)) {
            setSelecteds([...selecteds.filter((x) => x !== file.id)]);
        } else {
            if (multiple) {
                setSelecteds([...selecteds, file.id]);
            } else {
                setSelecteds([file.id]);
            }
        }
    };

    const uploadProps = {
        name: "file",
        multiple: true,
        showUploadList: false,
        customRequest: async (options) => {
            const { onSuccess, onError, file, onProgress } = options;
            const fmData = new FormData();

            fmData.append("file", file);
            if (folder) fmData.append("folder", folder);
            try {
                setUploading({
                    ...uploading,
                    [file.uid]: 0,
                });
                var res = await attachmentActions.upload(
                    fmData,
                    {
                        onUploadProgress: (event) => {
                            const percent = Math.floor(
                                (event.loaded / event.total) * 100
                            );
                            setUploading({
                                ...uploading,
                                [file.uid]: percent,
                            });
                            onProgress({
                                percent: (event.loaded / event.total) * 100,
                            });
                        },
                    },
                    file.uid
                );

                delete uploading[file.uid];

                setUploading({
                    ...uploading,
                });
                return onSuccess(res.url);
            } catch (err) {
                console.log("Eroor: ", err);
                onError({ err });
            }
        },
    };

    //destroy image
    const destroyImage = async (id) => {
        setDeletings([...deletings, id]);
        await attachmentActions.destroy(id);
        setDeletings([...deletings.filter((x) => x !== id)]);
    };

    return (
        <Modal
            okButtonProps={{
                disabled: selecteds.length == 0,
            }}
            onOk={() => {
                onSelectFile(
                    attachment.items.filter((x) => selecteds.includes(x.id))
                );
                onRequestClose();
            }}
            visible={show}
            onCancel={onRequestClose}
            title="Quản lý file"
            width={width - 60}
            centered
        >
            <div className="mb-2">
                <Button
                    onClick={() => setShowAddFolder(true)}
                    type="primary"
                    icon={<FontAwesomeIcon icon={["fas", "add"]} />}
                >
                    Thêm thư mục
                </Button>
            </div>
            <div className="flex">
                <div
                    className="w-60 mr-auto text-lg"
                    style={{
                        height: 500,
                        background: "#fafafa",
                        border: "1px dashed #d9d9d9",
                    }}
                >
                    <DirectoryTree
                        fieldNames={{
                            title: "name",
                        }}
                        treeData={[
                            {
                                id: 0,
                                name: "Thư mục gốc",
                                children: folders,
                            },
                        ]}
                        titleRender={(item) => (
                            <p className="inline-block pr-2 py-1">
                                {item.title}
                                {item.id && (
                                    <span className="absolute  right-1 top-0.5">
                                        <FontAwesomeIcon
                                            className="mr-1"
                                            icon={["fas", "edit"]}
                                            onClick={() => {
                                                setEditFolder(item);
                                                setShowAddFolder(true);
                                            }}
                                        />
                                        <Popconfirm
                                            title="Bạn chắc chắn chứ?"
                                            onConfirm={() =>
                                                attachmentActions.destroyFolder(
                                                    item.id
                                                )
                                            }
                                        >
                                            <FontAwesomeIcon
                                                icon={["fas", "remove"]}
                                            />
                                        </Popconfirm>
                                    </span>
                                )}
                            </p>
                        )}
                        onSelect={(selecteds) => setSelectedId(selecteds)}
                    />
                </div>
                <FileList className="relative ml-2 flex-1">
                    {loading && (
                        <Spin
                            size="large"
                            className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        />
                    )}

                    <div className="absolute top-0 left-0 right-0 bottom-0 z-10">
                        <Dragger {...uploadProps}>
                            {attachment.loaded && attachment.items.length == 0 && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">
                                        Chưa có dữ liệu.Bạn có thể kéo thả file
                                        vào đây để upload
                                    </p>
                                </div>
                            )}
                        </Dragger>
                    </div>
                    <Scrollbars style={{ height: 500 }}>
                        <div className="overflow-x-hidden px-4">
                            <Row gutter={16}>
                                {attachment.items.map((item) => (
                                    <Col
                                        className="my-2"
                                        span={4}
                                        key={item.id}
                                    >
                                        <Popover
                                            content={
                                                <PopoverContent {...item} />
                                            }
                                        >
                                            <div
                                                style={{ minHeight: 210 }}
                                                className="relative border h-full border-gray-200 z-20 bg-white"
                                            >
                                                {deletings.includes(
                                                    item.id
                                                ) && (
                                                    <Spin
                                                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -transate-y-1/2 z-30"
                                                        size="large"
                                                    />
                                                )}
                                                {uploading[item.id] && (
                                                    <Progress
                                                        percent={item.percent}
                                                        className="absolute top-1/2 left-3 right-3 -translate-y-1/2 w-11/12"
                                                    />
                                                )}

                                                <FontAwesomeIcon
                                                    size="1x"
                                                    onClick={() =>
                                                        destroyImage(item.id)
                                                    }
                                                    className="text-red-500 absolute top-2 right-2 z-30 cursor-pointer"
                                                    icon="fas fa-minus-circle"
                                                />
                                                <Image src={item.url} />
                                                <div
                                                    onClick={() =>
                                                        onSelectImage(item)
                                                    }
                                                    className="p-3 flex cursor-pointer"
                                                >
                                                    <Checkbox
                                                        checked={selecteds.includes(
                                                            item.id
                                                        )}
                                                        className=" mr-auto"
                                                    />
                                                    <p className="px-2 text-center block flex-1 overflow-x-hidden whitespace-nowrap">
                                                        {item.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </Popover>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </Scrollbars>
                </FileList>
            </div>
            <AddFolder
                show={showAddFolder}
                selectedId={selectedId}
                editFolder={editFolder}
                destroyOnClose
                onRequestClose={() => {
                    setShowAddFolder(false);
                    setEditFolder(null);
                }}
            />
        </Modal>
    );
};

export default FileManager;

//convert byte to size
function convertByteToSize(bytes) {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "0 Byte";
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

const PopoverContent = ({ name, size, url }) => {
    url = location.origin + "/" + url;
    return (
        <div>
            <p>Tên file: {name}</p>
            <p>Kích thước: {convertByteToSize(size)}</p>
            <p>
                Url:
                <a href={url} target="_blank">
                    {url}
                </a>
            </p>
        </div>
    );
};

const FileList = styled.div``;

const AddFolder = ({ show, onRequestClose, selectedId, editFolder }) => {
    const [form] = Form.useForm();
    const actions = useAttachmentActions();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (editFolder) {
            form.setFieldsValue({
                name: editFolder.name,
            });
        } else {
            form.resetFields();
        }
    }, [selectedId, editFolder]);
    const onSave = () => {
        form.validateFields().then(async (values) => {
            setLoading(true);
            const data = {
                ...editFolder,
                ...values,
            };
            if (!!editFolder) {
                await actions.updateFolder(editFolder.id, data);
            } else {
                await actions.createFolder({
                    ...data,
                    parent_id: selectedId ? selectedId[0] : null,
                });
            }
            setLoading(false);
            message.success("Thêm thư mục thành công");
            onRequestClose();
        });
    };

    return (
        <Modal
            confirmLoading={loading}
            onOk={onSave}
            visible={show}
            onCancel={onRequestClose}
            title="Thêm thư mục"
        >
            <Form form={form}>
                <Form.Item
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập tên thư mục",
                        },
                    ]}
                    label="Tên thư mục"
                    required
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};
