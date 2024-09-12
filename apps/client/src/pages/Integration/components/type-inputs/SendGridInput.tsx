import React, { useEffect } from "react";

type Props = {
  dispatch: React.Dispatch<any>;
};

const SendGridInput = ({ dispatch }: Props) => {
  useEffect(() => {
    dispatch({
      type: "dataVal",
      payload: { apiKey: "" },
    });
  }, []);
  return (
    <>
      <div>
        <label className="block mb-2 text-sm font-medium">Api Key</label>
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 rounded-lg block w-full p-2.5"
          placeholder="e.g. 16642c21d157b6dlkswb672c474d5fe08-2b755df8-efa1d7f6"
          onChange={(e) =>
            dispatch({
              type: "dataVal",
              payload: { apiKey: e.target.value },
            })
          }
        />
      </div>
    </>
  );
};

export default SendGridInput;
