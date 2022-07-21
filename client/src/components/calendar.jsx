import { DatePicker, Space } from "antd";

const dateFormat = "YYYY-MM-DD";
const customFormat = (value) => `${value.format(dateFormat)}`;
const Calendar = (props) => {
    const onChange = (date, dateString) => {
        props.onChange(dateString);
    };

    return (
        <div>
            <DatePicker onChange={onChange} format={customFormat} placeholder={props.placeholder} />
        </div>
    );
};

export default Calendar;
