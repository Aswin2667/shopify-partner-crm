import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";

type Props = {
  dispatch: React.Dispatch<any>;
};

const ShopifyInput = ({ dispatch }: Props) => {
  useEffect(() => {
    dispatch({ type: "dataVal", payload: { appId: "" } });
  }, []);

  return (
    <div className="mt-4">
      <label className="block mb-2 text-sm font-medium">App ID</label>
      <Input
        type="number"
        className=" border rounded-lg block w-full p-2.5"
        placeholder="e.g. 123456"
        onChange={(e) =>
          dispatch({
            type: "dataVal",
            payload: { appId: e.target.value },
          })
        }
      />
    </div>
  );
};

export default ShopifyInput;
