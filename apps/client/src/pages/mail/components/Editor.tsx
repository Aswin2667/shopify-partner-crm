import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./custom.css";
export default function EmailEditor({ value, setValue }: any) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indend: "-1" },
        { indent: "+1" },
      ],
      ["clean"],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
    ],
  };
  return (
    <ReactQuill
      className="editor-input"
      theme="snow"
      modules={modules}
      value={value}
      onChange={setValue}
    />
  );
}
