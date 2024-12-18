'use client';

import React from 'react';
import FroalaEditorComponent from 'react-froala-wysiwyg';

// Froala Editor CSS files
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

// Froala plugins
import 'froala-editor/js/plugins/char_counter.min.js';
import 'froala-editor/js/plugins/image.min.js';
import 'froala-editor/js/plugins/save.min.js';
import 'froala-editor/js/plugins/markdown.min.js';
import 'froala-editor/js/plugins/code_view.min.js';


const MyFroalaEditor = ({ config, tag, model, onModelChange }) => {
  return <FroalaEditorComponent tag={tag} config={config} model={model} onModelChange={onModelChange} />;
};

export default MyFroalaEditor;
