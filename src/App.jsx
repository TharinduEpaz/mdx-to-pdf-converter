import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./index.css";
import MDXRenderer from "./MDXRenderer";


function App() {
  const [markdown, setMarkdown] = useState(
    '# Hello, Markdown!\n\nWrite your **Markdown** content here.\n\n## Features\n\n- Convert Markdown to PDF\n- Beautiful formatting\n- Real-time preview\n\n```javascript\nconsole.log("Hello, World!");\n```'
  );
  const previewRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExportToPDF = async () => {
    if (!previewRef.current) return;

    setIsGenerating(true);

    try {
      const previewElement = previewRef.current;
      const canvas = await html2canvas(previewElement, {
        scale: 4, // Higher scale for better quality
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");

      // A4 paper size: 210 x 297 mm
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add image to PDF
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // If content extends beyond a page, handle pagination
      if (imgHeight > 297) {
        let remainingHeight = imgHeight;
        let position = 0;
        const pageHeight = 297;

        while (remainingHeight > 0) {
          position += pageHeight;
          remainingHeight -= pageHeight;
          
          if (remainingHeight > 0) {
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, -position, imgWidth, imgHeight);
          }
        }
      }

      // Download the PDF
      pdf.save("markdown-document.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <h1 className="text-3xl font-bold text-center">MDX to PDF Converter</h1>
      </header>

      <main className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Editor */}
          <div className="lg:w-1/2">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Markdown Editor</h2>
              <textarea
                className="w-full h-[600px] p-4 border rounded-lg shadow-inner font-mono"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Write your Markdown here..."
              />
            </div>

            <button
              onClick={handleExportToPDF}
              disabled={isGenerating}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? "Generating PDF..." : "Export to PDF"}
            </button>
          </div>

          {/* Preview */}
          <div className="lg:w-1/2">
            <h2 className="text-xl font-semibold mb-2">Preview</h2>
            <div
              ref={previewRef}
              className="markdown-preview bg-white p-8 border rounded-lg shadow min-h-[600px] overflow-auto"
            >
              <MDXRenderer>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
              </MDXRenderer>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center mt-8">
        <p>Made with React, MDX, and jsPDF</p>
      </footer>
    </div>
  );
}

export default App;
