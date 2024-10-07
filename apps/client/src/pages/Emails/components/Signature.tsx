import { Button } from "@/components/ui/button";
 import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Editor from "../../mail/components/Editor";
import { useMutation } from "@tanstack/react-query";
import OrgMemberService from "@/services/OrgMemberService";

const Signature = () => {
  const orgMemberDetails = JSON.parse(
    localStorage.getItem("presentOrgMemberDetails") ?? ""
  );
  const [value, setValue] = React.useState<string>(
    ""
    // "<p>--</p><p><br></p><p> </p>"
  );

  const { mutate: generateSignature } = useMutation({
    mutationFn: async (data: any) => OrgMemberService.generateSignature(data),
    onSuccess: (res) => console.log(res),
    onError: (error) => console.error(error),
  });

  const saveHandler = () => {
    console.log(value, orgMemberDetails?.id);
    generateSignature({
      orgMemberId: orgMemberDetails?.id,
      signature: value,
    });
  };

  useEffect(() => {
    if (orgMemberDetails?.signature) {
      setValue(orgMemberDetails?.signature);
    }
  }, []);

  return (
    <div className="max-w-3xl">
      <br />

      <h2 className="text-lg font-semibold mb-2">Email Signature</h2>
      <br />

      <Editor value={value} setValue={setValue} />
      <br />
      <div className="flex justify-end items-center">
        <Button onClick={saveHandler}>Save</Button>
      </div>

      <Link
        to={""}
        className="text-sm text-blue-600 hover:underline block mt-2"
      >
        Learn more about Email Signatures
      </Link>
    </div>
  );
};

export default Signature;
