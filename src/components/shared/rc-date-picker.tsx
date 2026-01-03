import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const RcDatePicker = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);

  return (
    <DatePicker
      selected={startDate}
      onChange={(date: Date | null) => setStartDate(date)}
      isClearable
      placeholderText="Select a date"
    />
  );
};

export default RcDatePicker;
