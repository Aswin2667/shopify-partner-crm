import { useEffect, useReducer } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Copy } from "lucide-react";
import { TbArrowNarrowLeft } from "react-icons/tb";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import UnsubscribeLinkService from "@/services/UnSubscribeLinkService";
import MailService from "@/services/MailService";

const initialArgs = {
  fromName: { value: "", error: null },
  fromEmail: { value: "", error: null },
  replyTo: { value: "", error: null },
};

const reducerFn = (prevState: any, action: any) => {
  if (action.type === "fromNameVal" || action.type === "fromNameErr") {
    return action.type === "fromNameVal"
      ? {
          ...prevState,
          fromName: { ...prevState.fromName, value: action.payload },
        }
      : {
          ...prevState,
          fromName: { ...prevState.fromName, error: action.payload },
        };
  }
  if (action.type === "fromEmailVal" || action.type === "fromEmailErr") {
    return action.type === "fromEmailVal"
      ? {
          ...prevState,
          fromEmail: { ...prevState.fromEmail, value: action.payload },
        }
      : {
          ...prevState,
          fromEmail: { ...prevState.fromEmail, error: action.payload },
        };
  }
  if (
    action.type === "replyToVal" ||
    action.type === "replyToErr" ||
    action.type === "replyToReset"
  ) {
    return action.type === "replyToVal"
      ? {
          ...prevState,
          replyTo: { ...prevState.replyTo, value: action.payload },
        }
      : action.type === "replyToErr"
        ? {
            ...prevState,
            replyTo: { ...prevState.replyTo, error: action.payload },
          }
        : {
            ...prevState,
            replyTo: { value: "", error: null },
          };
  }

  if (action.type === "reset") {
    return initialArgs;
  }

  return prevState;
};

export default function UnsubscribeLinkEditor() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { sendAsId, organizationId } = useParams();

  const [sendAs, dispatch] = useReducer(
    reducerFn,
    initialArgs,
    () => initialArgs
  );

  const { sendAs: sendAsList } = useSelector((state: any) => state.mail);

  const { mutate } = useMutation({
    mutationFn: async (data: any) => await MailService.updateFromEmail(data),
    onSuccess: (response) => {
      console.log(response);
      // queryClient.invalidateQueries({
      //   queryKey: ["getUnsubscribeLinks", organizationId],
      // });
      navigate(`..`);
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

  const saveHandler = () => {
    const data = {
      id: sendAsId,
      fromName: sendAs.fromName.value,
      fromEmail: sendAs.fromEmail.value,
      replyTo: sendAs.replyTo.value,
      organizationId: organizationId,
    };

    console.log(data);
    mutate(data);
  };

  useEffect(() => {
    if (sendAsId) {
      const sendAs = sendAsList.find((sendAs: any) => sendAs.id === sendAsId);
      if (sendAs.id) {
        dispatch({ type: "fromNameVal", payload: sendAs.fromName });
        dispatch({ type: "fromEmailVal", payload: sendAs.fromEmail });
        dispatch({
          type: "replyToVal",
          payload: sendAs.replyTo,
        });
      }
    }
  }, [sendAsId]);

  return (
    <div className="w-full mx-auto p-6">
      <header className="flex justify-between items-center mb-6">
        {/* Breadcrumb */}
        <div className="border-b p-5 w-full">
          <Link
            to=".."
            className="flex items-center gap-1 text-sm text-[#767676]
          hover:text-gray-800 w-fit"
          >
            <TbArrowNarrowLeft size={20} />

            <h6 className="">Edit Send As Details</h6>
          </Link>
          <h1 className="text-2xl font-medium">
            {sendAs.fromName.value
              ? sendAs.fromName.value
              : "New Unsubscribe Link"}
          </h1>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </Button>
          <Button variant="outline" onClick={() => navigate(`..`)}>
            Cancel
          </Button>
          <Button onClick={saveHandler} disabled={!sendAs.fromName.value}>
            Update
          </Button>
        </div>
      </header>

      <form className="space-y-6">
        {/* From Name */}
        <div>
          <label className="block mb-2 text-sm font-medium" htmlFor="fromName">
            From Name
          </label>
          <input
            id="fromName"
            type="text"
            value={sendAs.fromName.value}
            onChange={(e) => {
              dispatch({ type: "fromNameVal", payload: e.target.value });
            }}
            onFocus={() => {
              sendAs.fromName.error &&
                dispatch({ type: "fromNameErr", payload: "" });
            }}
            className={`bg-gray-50 border ${
              sendAs.fromName.error ? "border-red-500 " : "border-gray-300"
            } rounded-lg block w-full p-2.5`}
            placeholder="Default Unsubscribe Link"
          />
          {sendAs.fromName.error && (
            <p className="mt-2 text-sm text-red-600">{sendAs.fromName.error}</p>
          )}
        </div>

        {/* From Email */}
        <div>
          <label className="block mb-2 text-sm font-medium" htmlFor="fromEmail">
            From Email
          </label>
          <textarea
            id="fromEmail"
            value={sendAs.fromEmail.value}
            onChange={(e) => {
              dispatch({ type: "fromEmailVal", payload: e.target.value });
            }}
            onFocus={() => {
              sendAs.fromEmail.error &&
                dispatch({ type: "fromEmailErr", payload: "" });
            }}
            className={`bg-gray-50 border ${
              sendAs.fromEmail.error ? "border-red-500 " : "border-gray-300"
            } rounded-lg block w-full p-2.5`}
            placeholder="To stop receiving these emails,"
          />
          {sendAs.fromEmail.error && (
            <p className="mt-2 text-sm text-red-600">
              {sendAs.fromEmail.error}
            </p>
          )}
        </div>

        {/* Reply To */}
        <div>
          <label className="block mb-2 text-sm font-medium" htmlFor="replyTo">
            Reply To
          </label>
          <input
            id="replyTo"
            type="text"
            value={sendAs.replyTo.value}
            onChange={(e) => {
              dispatch({ type: "replyToVal", payload: e.target.value });
            }}
            onFocus={() => {
              sendAs.replyTo.error &&
                dispatch({ type: "replyToErr", payload: "" });
            }}
            className={`bg-gray-50 border ${
              sendAs.replyTo.error ? "border-red-500 " : "border-gray-300"
            } rounded-lg block w-full p-2.5`}
            placeholder="e.g. Click here"
          />
          {sendAs.replyTo.error && (
            <p className="mt-2 text-sm text-red-600">{sendAs.replyTo.error}</p>
          )}
        </div>
      </form>
    </div>
  );
}
