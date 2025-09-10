import React from "react";
import { Editor } from "@tinymce/tinymce-react"; // Using TinyMCE editor

export default function RichTextEditor({ value, onChange }) {
  return (
    <Editor
      apiKey="your-tinymce-api-key" // optional, can be empty
      value={value}
      onEditorChange={onChange}
      init={{
        height: 300,
        menubar: false,
        plugins: [
          "advlist autolink lists link image charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table paste code help wordcount"
        ],
        toolbar:
          "undo redo | formatselect | bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat | help"
      }}
    />
  );
}
