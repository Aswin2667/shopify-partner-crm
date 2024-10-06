import { useEffect, useReducer } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Copy } from "lucide-react";
import { TbArrowNarrowLeft } from "react-icons/tb";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import UnsubscribeLinkService from "@/services/UnSubscribeLinkService";

const initialArgs = {
  name: { value: "", error: null },
  message: { value: "", error: null },
  anchorText: { value: "", error: null },
};

const reducerFn = (prevState: any, action: any) => {
  if (action.type === "nameVal" || action.type === "nameErr") {
    return action.type === "nameVal"
      ? {
          ...prevState,
          name: { ...prevState.name, value: action.payload },
        }
      : {
          ...prevState,
          name: { ...prevState.name, error: action.payload },
        };
  }
  if (action.type === "messageVal" || action.type === "messageErr") {
    return action.type === "messageVal"
      ? {
          ...prevState,
          message: { ...prevState.message, value: action.payload },
        }
      : {
          ...prevState,
          message: { ...prevState.message, error: action.payload },
        };
  }
  if (
    action.type === "anchorTextVal" ||
    action.type === "anchorTextErr" ||
    action.type === "anchorTextReset"
  ) {
    return action.type === "anchorTextVal"
      ? {
          ...prevState,
          anchorText: { ...prevState.anchorText, value: action.payload },
        }
      : action.type === "anchorTextErr"
        ? {
            ...prevState,
            anchorText: { ...prevState.anchorText, error: action.payload },
          }
        : {
            ...prevState,
            anchorText: { value: "", error: null },
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
  const { unsubscribeLinkId, organizationId } = useParams();

  const isNew = unsubscribeLinkId === "new";

  const [unSubscribeLink, dispatch] = useReducer(
    reducerFn,
    initialArgs,
    () => initialArgs
  );

  const { unsubscribeLinks } = useSelector((state: any) => state.organization);

  const { mutate } = useMutation({
    mutationFn: async (data: any) => await UnsubscribeLinkService.create(data),
    onSuccess: (response) => {
      console.log(response);
      queryClient.invalidateQueries({
        queryKey: ["getUnsubscribeLinks", organizationId],
      });
      navigate(`..`);
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

  const saveHandler = () => {
    const unsubscribeLink = {
      id: isNew ? "1" : unsubscribeLinkId,
      name: unSubscribeLink.name.value,
      message: unSubscribeLink.message.value,
      anchorText: unSubscribeLink.anchorText.value,
      organizationId: organizationId,
    };

    console.log(unsubscribeLink);
    mutate(unsubscribeLink);
  };

  useEffect(() => {
    if (unsubscribeLinkId && !isNew) {
      const unsubscribeLink = unsubscribeLinks.find(
        (link: any) => link.id === unsubscribeLinkId
      );
      if (unsubscribeLink.id) {
        dispatch({ type: "nameVal", payload: unsubscribeLink.name });
        dispatch({ type: "messageVal", payload: unsubscribeLink.message });
        dispatch({
          type: "anchorTextVal",
          payload: unsubscribeLink.anchorText,
        });
      }
    }
  }, [unsubscribeLinkId, unsubscribeLinks, isNew]);

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

            <h6 className="">{`${isNew ? "New" : "Edit"} Unsubscribe Links`}</h6>
          </Link>
          <h1 className="text-2xl font-medium">
            {unSubscribeLink.name.value
              ? unSubscribeLink.name.value
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
          <Button onClick={saveHandler}>{isNew ? "Save" : "Update"}</Button>
        </div>
      </header>

      <form className="space-y-6">
        {/* Name */}
        <div>
          <label className="block mb-2 text-sm font-medium" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={unSubscribeLink.name.value}
            onChange={(e) => {
              dispatch({ type: "nameVal", payload: e.target.value });
            }}
            onFocus={() => {
              unSubscribeLink.name.error &&
                dispatch({ type: "nameErr", payload: "" });
            }}
            className={`bg-gray-50 border ${
              unSubscribeLink.name.error ? "border-red-500 " : "border-gray-300"
            } rounded-lg block w-full p-2.5`}
            placeholder="Default Unsubscribe Link"
          />
          {unSubscribeLink.name.error && (
            <p className="mt-2 text-sm text-red-600">
              {unSubscribeLink.name.error}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block mb-2 text-sm font-medium" htmlFor="message">
            Unsubscribe Message
          </label>
          <textarea
            id="message"
            value={unSubscribeLink.message.value}
            onChange={(e) => {
              dispatch({ type: "messageVal", payload: e.target.value });
            }}
            onFocus={() => {
              unSubscribeLink.message.error &&
                dispatch({ type: "messageErr", payload: "" });
            }}
            className={`bg-gray-50 border ${
              unSubscribeLink.message.error
                ? "border-red-500 "
                : "border-gray-300"
            } rounded-lg block w-full p-2.5`}
            placeholder="To stop receiving these emails,"
          />
          {unSubscribeLink.message.error && (
            <p className="mt-2 text-sm text-red-600">
              {unSubscribeLink.message.error}
            </p>
          )}
        </div>

        {/* Anchor Text */}
        <div>
          <label
            className="block mb-2 text-sm font-medium"
            htmlFor="anchorText"
          >
            Anchor Text
          </label>
          <input
            id="anchorText"
            type="text"
            value={unSubscribeLink.anchorText.value}
            onChange={(e) => {
              dispatch({ type: "anchorTextVal", payload: e.target.value });
            }}
            onFocus={() => {
              unSubscribeLink.anchorText.error &&
                dispatch({ type: "anchorTextErr", payload: "" });
            }}
            className={`bg-gray-50 border ${
              unSubscribeLink.anchorText.error
                ? "border-red-500 "
                : "border-gray-300"
            } rounded-lg block w-full p-2.5`}
            placeholder="e.g. Click here"
          />
          {unSubscribeLink.anchorText.error && (
            <p className="mt-2 text-sm text-red-600">
              {unSubscribeLink.anchorText.error}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

{
  /* <div>
<label
  htmlFor="name"
  className="block text-sm font-medium text-gray-700 mb-1"
>
  Name<span className="text-red-500">*</span>
</label>
<Input
  id="name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="w-full"
  required
/>
</div>

<div>
<label
  htmlFor="message"
  className="block text-sm font-medium text-gray-700 mb-1"
>
  Unsubscribe Message<span className="text-red-500">*</span>
</label>
<div className="border rounded-md">
  <Textarea
    id="message"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    className="w-full min-h-[100px] p-2"
    required
  />
  <div className="flex justify-between items-center p-2 border-t">
    <div className="flex space-x-2">
      <Button variant="ghost" size="sm">
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <Italic className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <Underline className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        A
      </Button>
      <Button variant="ghost" size="sm">
        <List className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <Quote className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <Undo className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <Code className="h-4 w-4" />
      </Button>
    </div>
    <span className="text-sm text-gray-500">
      {message.length}/1000
    </span>
  </div>
</div>
</div> */
}
