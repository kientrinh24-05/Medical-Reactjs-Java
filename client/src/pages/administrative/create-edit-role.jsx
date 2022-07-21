import { Card, Checkbox, Col, Form, Input, message, Modal, Row } from "antd";
import { useRecoilValue } from "recoil";
import { useState, useEffect } from "react";
import { permissionAtom, userCan } from "@/_state";
import RoleSelect from "./select";

const labelMap = {
    create: "Thêm",
    update: "Cập nhật",
    delete: "Xoá",
    manage: "Quản lý",
};

const UpdateEditRole = ({ show, onRequestClose, model,onChange }) => {
    const [caps, setCaps] = useState([]);
    const permissions = useRecoilValue(permissionAtom);
    const [form] = Form.useForm();
    const isEdit = !!model?.id;

    useEffect(() => {
        if (show && isEdit && !!model.id) {
            setCaps(model.permissions);
            form.setFieldsValue(model);
        } else {
            form.resetFields();
            setCaps([]);
        }
    }, [model]);
    const onSave = () => {
        form.validateFields().then((values) => {
            const data = {
                ...model,
                ...values,
                permissions: caps,
            };
            onChange(data);
            onRequestClose();
        });
    };

    return (
        <Modal
            title={isEdit ? "Chỉnh sửa chức vụ" : "Thêm chức vụ"}
            onCancel={onRequestClose}
            onOk={onSave}
            centered
            visible={show}
            width={1000}
            okText={"Lưu"}
            cancelText={"Hủy"}
        >
            <Card title="Thông tin">
                <Form form={form}>
                    <Form.Item
                        name="name"
                        label="Tên chức vụ"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên chức vụ",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="parent_id" label="Cấp dưới của">
                        <RoleSelect
                            filter={{
                                department_id: model?.department_id,
                                excludeIds: [model?.id],
                            }}
                        />
                    </Form.Item>
                    <Row gutter={20}>
                        {permissions.map((x) => (
                            <Col key={x.category} span={8}>
                                <Card
                                    className="mb-3"
                                    title={
                                        <div>
                                            <Checkbox
                                                className="mr-2"
                                                checked={x.caps.every((c) =>
                                                    caps.includes(c)
                                                )}
                                                onChange={(e) =>
                                                    setCaps(
                                                        e.target.checked
                                                            ? [
                                                                  ...new Set([
                                                                      ...caps,
                                                                      ...x.caps,
                                                                  ]),
                                                              ]
                                                            : [
                                                                  ...caps.filter(
                                                                      (c) =>
                                                                          !x.caps.includes(
                                                                              c
                                                                          )
                                                                  ),
                                                              ]
                                                    )
                                                }
                                            />
                                            {x.category}
                                        </div>
                                    }
                                >
                                    {x.caps.map((cap) => (
                                        <div className="flex" key={cap}>
                                            <Checkbox
                                                className="mr-2"
                                                checked={caps.includes(cap)}
                                                onChange={(e) =>
                                                    setCaps(
                                                        e.target.checked
                                                            ? [...caps, cap]
                                                            : [
                                                                  ...caps.filter(
                                                                      (c) =>
                                                                          c !=
                                                                          cap
                                                                  ),
                                                              ]
                                                    )
                                                }
                                            />
                                            <label>
                                                {labelMap[cap.split(".")[1]]}{" "}
                                                {x.category}
                                            </label>
                                        </div>
                                    ))}
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Form>
            </Card>
        </Modal>
    );
};

export default UpdateEditRole;
