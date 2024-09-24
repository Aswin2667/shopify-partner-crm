import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";

type Props = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

const SelectMailType = ({ value, setValue }: Props) => {
  const mailServices = useSelector(
    (state: any) => state.integration.integrations
  ).filter((int: any) => int.category === "MAIL_SERVICE");
  console.log(mailServices);
  return (
    <Select onValueChange={(value) => setValue(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a Mail Service" />
      </SelectTrigger>
      <SelectContent defaultValue={value}>
        <SelectGroup>
          {/* <SelectLabel>Fruits</SelectLabel> */}
          <SelectItem value="ALL">ALL</SelectItem>
          {mailServices.map((service: any) => (
            <SelectItem key={service.id} value={service.type}>
              {service.type}
              <img src="" alt="" />
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectMailType;
