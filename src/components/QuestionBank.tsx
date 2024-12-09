import React, { useState } from 'react';
import type { Question } from '../types';
import { Image as ImageIcon, Edit, Trash2 } from 'lucide-react';
import { Button } from './ui/Button';

interface QuestionBankProps {
  questions: Question[];
  onSelectQuestion: (question: Question) => void;
  onDeselectQuestion: (questionId: string) => void;
  onEditQuestion: (question: Question) => void;
  onDeleteQuestion: (questionId: string) => void;
  selectedQuestionIds: Set<string>;
}

export function QuestionBank({
  questions,
  onSelectQuestion,
  onDeselectQuestion,
  onEditQuestion,
  onDeleteQuestion,
  selectedQuestionIds
}: QuestionBankProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [marks, setMarks] = useState<Record<string, number>>({});

  const subjects = Array.from(new Set(questions.map(q => q.subject)));
  const classes = Array.from(new Set(questions.map(q => q.class)));

  const filteredQuestions = questions.filter(q => 
    (!selectedSubject || q.subject === selectedSubject) &&
    (!selectedClass || q.class === selectedClass)
  );

  const handleQuestionSelect = (question: Question) => {
    if (selectedQuestionIds.has(question.id)) {
      onDeselectQuestion(question.id);
    } else {
      const questionWithMarks = {
        ...question,
        marks: marks[question.id] || 0
      };
      onSelectQuestion(questionWithMarks);
    }
  };

  const handleMarksChange = (questionId: string, value: string) => {
    const newMarks = { ...marks, [questionId]: parseInt(value) || 0 };
    setMarks(newMarks);
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">All Subjects</option>
          {subjects.map(subject => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">All Classes</option>
          {classes.map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredQuestions.map((question) => {
          const isSelected = selectedQuestionIds.has(question.id);
          return (
            <div
              key={question.id}
              className={`bg-white p-4 rounded-lg shadow-md transition-shadow ${
                isSelected ? 'ring-2 ring-indigo-500' : 'hover:shadow-lg'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{question.text}</p>
                  {question.imageUrl && (
                    <div className="mt-2">
                      <ImageIcon className="h-5 w-5 text-gray-400 inline mr-1" />
                      <span className="text-sm text-gray-500">Has image</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{question.subject}</span>
                  <span>Class {question.class}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={marks[question.id] || ''}
                    onChange={(e) => handleMarksChange(question.id, e.target.value)}
                    placeholder="Marks"
                    className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    min="0"
                  />
                  <Button
                    variant={isSelected ? 'secondary' : 'primary'}
                    onClick={() => handleQuestionSelect(question)}
                  >
                    {isSelected ? 'Deselect' : 'Select'}
                  </Button>
                  <Button
                    variant="secondary"
                    icon={Edit}
                    onClick={() => onEditQuestion(question)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    icon={Trash2}
                    onClick={() => onDeleteQuestion(question.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}