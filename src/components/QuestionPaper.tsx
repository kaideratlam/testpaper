import React from 'react';
import { useReactToPrint } from 'react-to-print';
import type { QuestionPaper as QuestionPaperType } from '../types';
import { FileDown, Printer } from 'lucide-react';
import jsPDF from 'jspdf';

interface QuestionPaperProps {
  paper: QuestionPaperType;
}

export function QuestionPaper({ paper }: QuestionPaperProps) {
  const componentRef = React.useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const generatePDF = () => {
    const doc = new jsPDF();
    const content = document.getElementById('question-paper-content');
    if (content) {
      doc.html(content, {
        callback: function (doc) {
          doc.save(`${paper.title}.pdf`);
        },
        x: 10,
        y: 10
      });
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{paper.title}</h2>
        <div className="space-x-4">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Printer className="h-4 w-4 mr-2" /> Print
          </button>
          <button
            onClick={generatePDF}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            <FileDown className="h-4 w-4 mr-2" /> Download PDF
          </button>
        </div>
      </div>

      <div ref={componentRef} id="question-paper-content" className="space-y-8">
        <div className="text-center border-b pb-4">
          <h1 className="text-2xl font-bold">{paper.title}</h1>
          <p className="text-gray-600">Class: {paper.class} | Subject: {paper.subject}</p>
          <p className="text-gray-600">Total Marks: {paper.totalMarks}</p>
        </div>

        <div className="space-y-6">
          {paper.questions.map((question, index) => (
            <div key={question.id} className="space-y-4">
              <div className="flex items-start">
                <span className="font-bold mr-2">{index + 1}.</span>
                <div className="flex-1">
                  <p className="text-gray-900">{question.text}</p>
                  {question.imageUrl && (
                    <img
                      src={question.imageUrl}
                      alt="Question"
                      className="mt-2 max-w-md rounded-md"
                    />
                  )}
                  <div className="mt-4 space-y-2">
                    {question.answers.map((answer, ansIndex) => (
                      <div key={answer.id} className="flex items-start ml-4">
                        <span className="mr-2">{String.fromCharCode(97 + ansIndex)})</span>
                        <div>
                          <p>{answer.text}</p>
                          {answer.imageUrl && (
                            <img
                              src={answer.imageUrl}
                              alt={`Answer ${ansIndex + 1}`}
                              className="mt-1 max-w-sm rounded-md"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <span className="ml-4 text-gray-600">[{question.marks} marks]</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}