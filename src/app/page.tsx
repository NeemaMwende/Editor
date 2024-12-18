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
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [isMarkdown, setIsMarkdown] = useState<boolean>(false); 

  useEffect(() => {
    const savedText = localStorage.getItem("savedText");
    if (savedText) {
      setModel(savedText);
      setIsMarkdown(containsMarkdown(savedText)); 
    }
  }, []);

  
  const containsMarkdown = (text: string): boolean => {
    const markdownRegex = /(\*\*.*?\*\*|__.*?__|#\s.*|`.*?`|-\s.*|\d+\.\s.*)/;
    return markdownRegex.test(text);
  };

  const handleModelChange = (e: string) => {
    setModel(e);
    const isMd = containsMarkdown(e);
    setIsMarkdown(isMd);
    setShowPreview(!isMd); 
  };

  // Handle file selection for markdown files
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setModel(content);
        setIsMarkdown(containsMarkdown(content)); 
        setShowPreview(!containsMarkdown(content)); // Show markdown preview only for markdown content
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Text Editor</h1>

      {/* File input for selecting markdown files */}
      <div className="mb-4">
        <input 
          type="file" 
          accept=".md,.markdown" 
          onChange={handleFileChange}
          className="mb-2"
        />
      </div>

      {/* Froala Editor */}
      <MyFroalaEditor
        model={model}
        onModelChange={handleModelChange}
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

      {/* Display markdown preview if it's markdown */}
      {showPreview && isMarkdown && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Markdown Preview</h2>
          <div className="border border-gray-300 p-4 rounded-md">
            
            <div dangerouslySetInnerHTML={{ __html: marked(model) }} />
          </div>
        </div>
      )}

      {/* Display regular text preview */}
      {showPreview && !isMarkdown && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Output Preview</h2>
          <div className="border border-gray-300 p-4 rounded-md">
            <div dangerouslySetInnerHTML={{ __html: model }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
