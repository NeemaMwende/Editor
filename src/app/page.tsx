'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { marked } from 'marked';

// Dynamically import the Froala Editor Component
const MyFroalaEditor = dynamic(() => import('@/app/components/FroalaEditorComponent'), {
  ssr: false,
});

const Page = () => {
  const [model, setModel] = useState<string>("");

  useEffect(() => {
    const savedText = localStorage.getItem("savedText");
    if (savedText) {
      setModel(savedText);
    }
  }, []);

  // Function to determine if the content contains Markdown syntax
  const containsMarkdown = (text: string): boolean => {
    const markdownRegex = /(\*\*.*?\*\*|__.*?__|#\s.*|`.*?`|-\s.*|\d+\.\s.*)/;
    return markdownRegex.test(text);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Froala Editor</h1>
      
      <MyFroalaEditor
        model={model}
        onModelChange={(e: string) => setModel(e)}
        config={{
          placeholderText: 'Enter your text here...',
          charCounterCount: true,
          charCounterMax: 1000,
          saveInterval: 2000,
          events: {
            "charCounter.exceeded": function () {
              alert("Character limit exceeded! Upgrade to increase limit.");
            },
            "save.before": function (html: string) {
              localStorage.setItem("savedText", html);
            },
          },
        }}
        tag="textarea"
      />

      {/* Display output */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Output Preview</h2>
        <div className="border border-gray-300 p-4 rounded-md">
          {containsMarkdown(model) ? (
            <div dangerouslySetInnerHTML={{ __html: marked(model) }} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: model }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
