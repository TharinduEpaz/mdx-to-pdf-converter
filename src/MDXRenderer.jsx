import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const components = {
  h1: props => <h1 className="text-3xl font-bold mb-4" {...props} />,
  h2: props => <h2 className="text-2xl font-semibold mb-3 mt-6" {...props} />,
  h3: props => <h3 className="text-xl font-semibold mb-2 mt-5" {...props} />,
  p: props => <p className="mb-4" {...props} />,
  a: props => <a className="text-blue-600 hover:underline" {...props} />,
  ul: props => <ul className="list-disc pl-6 mb-4" {...props} />,
  ol: props => <ol className="list-decimal pl-6 mb-4" {...props} />,
  blockquote: props => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />,
  hr: () => <hr className="my-6 border-t border-gray-300" />,
  table: props => <table className="min-w-full border border-gray-300 mb-4" {...props} />,
  th: props => <th className="border border-gray-300 px-4 py-2 bg-gray-100" {...props} />,
  td: props => <td className="border border-gray-300 px-4 py-2" {...props} />,
  code: ({className, children}) => {
    const match = /language-(\w+)/.exec(className || '');
    return match ? (
      <SyntaxHighlighter 
        style={vscDarkPlus} 
        language={match[1]} 
        className="rounded overflow-auto"
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className="bg-gray-100 px-1 py-0.5 rounded">{children}</code>
    );
  }
};

const MDXRenderer = ({ children }) => {
  return (
    <MDXProvider components={components}>
      {children}
    </MDXProvider>
  );
};

export default MDXRenderer;