import React, { useState } from 'react';
import { QuestionForm } from './components/QuestionForm';
import { QuestionBank } from './components/QuestionBank';
import { QuestionPaper } from './components/QuestionPaper';
import type { Question, QuestionPaper as QuestionPaperType } from './types';
import { PlusCircle, Library, FileText } from 'lucide-react';

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'add' | 'bank' | 'paper'>('add');
  const [paper, setPaper] = useState<QuestionPaperType | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const handleQuestionSubmit = (data: Omit<Question, 'id'>) => {
    if (editingQuestion) {
      const updatedQuestions = questions.map(q =>
        q.id === editingQuestion.id ? { ...data, id: editingQuestion.id } : q
      );
      setQuestions(updatedQuestions);
      setEditingQuestion(null);
    } else {
      const newQuestion: Question = {
        ...data,
        id: Date.now().toString(),
      };
      setQuestions([...questions, newQuestion]);
    }
    setActiveTab('bank');
  };

  const handleQuestionSelect = (question: Question) => {
    setSelectedQuestions([...selectedQuestions, question]);
    setSelectedQuestionIds(new Set([...selectedQuestionIds, question.id]));
  };

  const handleQuestionDeselect = (questionId: string) => {
    setSelectedQuestions(selectedQuestions.filter(q => q.id !== questionId));
    const newIds = new Set(selectedQuestionIds);
    newIds.delete(questionId);
    setSelectedQuestionIds(newIds);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setActiveTab('add');
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
    handleQuestionDeselect(questionId);
  };

  const handleCreatePaper = () => {
    if (selectedQuestions.length === 0) return;

    const newPaper: QuestionPaperType = {
      id: Date.now().toString(),
      title: `Question Paper - ${new Date().toLocaleDateString()}`,
      class: selectedQuestions[0].class,
      subject: selectedQuestions[0].subject,
      totalMarks: selectedQuestions.reduce((sum, q) => sum + (q.marks || 0), 0),
      questions: selectedQuestions,
    };
    setPaper(newPaper);
    setActiveTab('paper');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="sm:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as 'add' | 'bank' | 'paper')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="add">{editingQuestion ? 'Edit' : 'Add'} Question</option>
              <option value="bank">Question Bank</option>
              <option value="paper">Question Paper</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('add')}
                className={`${
                  activeTab === 'add'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                } px-3 py-2 rounded-md text-sm font-medium flex items-center`}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                {editingQuestion ? 'Edit' : 'Add'} Question
              </button>
              <button
                onClick={() => setActiveTab('bank')}
                className={`${
                  activeTab === 'bank'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                } px-3 py-2 rounded-md text-sm font-medium flex items-center`}
              >
                <Library className="h-4 w-4 mr-2" /> Question Bank
              </button>
              <button
                onClick={() => setActiveTab('paper')}
                className={`${
                  activeTab === 'paper'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                } px-3 py-2 rounded-md text-sm font-medium flex items-center`}
              >
                <FileText className="h-4 w-4 mr-2" /> Question Paper
              </button>
            </nav>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          {activeTab === 'add' && (
            <QuestionForm
              onSubmit={handleQuestionSubmit}
              initialQuestion={editingQuestion}
            />
          )}

          {activeTab === 'bank' && (
            <div className="space-y-6">
              <QuestionBank
                questions={questions}
                onSelectQuestion={handleQuestionSelect}
                onDeselectQuestion={handleQuestionDeselect}
                onEditQuestion={handleEditQuestion}
                onDeleteQuestion={handleDeleteQuestion}
                selectedQuestionIds={selectedQuestionIds}
              />
              {selectedQuestions.length > 0 && (
                <div className="fixed bottom-4 right-4">
                  <button
                    onClick={handleCreatePaper}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Create Question Paper ({selectedQuestions.length} selected)
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'paper' && paper && (
            <QuestionPaper paper={paper} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;