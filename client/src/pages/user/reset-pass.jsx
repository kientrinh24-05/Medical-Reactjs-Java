import { Form, Input, message, Modal } from "antd";
import { useUserActions } from '@/_actions';
import { useState,useEffect } from 'react';

const ResetPass = ({ show, onRequestClose, model }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const actions = useUserActions();

    useEffect(()=>{
        form.resetFields();
    },[model])
    
    const save =async () => {
        form.validateFields().then(async (values) => {
            try{
            setLoading(true);
            await actions.resetPass(model.id, values);
            message.success("Cập nhật mật khẩu thành công");
            setLoading(false);
            onRequestClose();
        }catch(e){
            setLoading(false);
            message.error("Có lỗi xảy ra",e);
        }
        });
    };

    return (
        <Modal
        title="Đổi mật khẩu"
            visible={show}
            onCancel={onRequestClose}
            okText="Lưu"
            onOk={save}
           confirmLoading={loading}
        >
            <Form form={form}
                  labelCol={{
                    span: 8,
                }}
            >
                <Form.Item
                    label="Mật khẩu mới"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập mật khẩu mới",
                        },
                        {
                            min: 6,
                            message: "Mật khẩu phải có ít nhất 6 ký tự",
                        }
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="Xác nhận mật khẩu"
                    name="re-password"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng xác nhận mật khẩu",
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !value ||
                                    getFieldValue("password") === value
                                ) {
                                    return Promise.resolve();
                                }

                                return Promise.reject(
                                    new Error("Mật khẩu xác nhận không khớp")
                                );
                            },
                        }),
                    ]}
                >
                    <Input.Password type={"password"} />
                </Form.Item>
            </Form>
        </Modal>
    );
};
export default ResetPass;