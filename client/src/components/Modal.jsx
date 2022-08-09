import React, {  } from 'react';
import { Modal  } from 'antd';
import PropTypes from 'prop-types';

function ModalForm({ children, title, width, visible, onOk, onCancel, footer }) {
    return (
        <>
            <Modal
                title={title}
                centered
                visible={visible}
                onOk={() => onOk()}
                onCancel={() => onCancel()}
                width={width}
                footer={null}
            >
                {children}
            </Modal>
        </>
    );
}
ModalForm.propTypes = {
    title: PropTypes.string,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    width: PropTypes.number,
    footer: PropTypes.array,
}

ModalForm.defaultProps = {
    placeholder: "",
}
export default ModalForm;