"use client";

import { useState } from "react";
import FroalaEditor from "react-froala-wysiwyg";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState<string>("");

  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMarkdown(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl text-center font-bold mb-4">Markdown Editor</h1>

      <input
        type="file"
        accept=".md"
        onChange={handleFileUpload}
        className="mb-4"
      />

      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        placeholder="Write your markdown here..."
        className="w-full h-48 p-2 border rounded mb-4"
        
      />

      <div className="p-4 border rounded">
        <h2 className="text-2xl font-semibold mb-2">Preview:</h2>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        
      </div>
      <FroalaEditor/>
    </div>
  );
};

export default MarkdownEditor;
