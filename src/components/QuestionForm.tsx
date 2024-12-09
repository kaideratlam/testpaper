import React, { useState, useEffect } from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { DraggableImage } from './DraggableImage';
import type { Answer, Question } from '../types';
import { Button } from './ui/Button';

interface QuestionFormProps {
  onSubmit: (data: Omit<Question, 'id'>) => void;
  initialQuestion?: Question | null;
}

export function QuestionForm({ onSubmit, initialQuestion }: QuestionFormProps) {
  const [text, setText] = useState('');
  const [imageData, setImageData] = useState('');
  const [subject, setSubject] = useState('');
  const [className, setClassName] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([{ id: '1', text: '', imageUrl: '' }]);

  useEffect(() => {
    if (initialQuestion) {
      setText(initialQuestion.text);
      setImageData(initialQuestion.imageUrl || '');
      setSubject(initialQuestion.subject);
      setClassName(initialQuestion.class);
      setAnswers(initialQuestion.answers);
    }
  }, [initialQuestion]);

  const handleAddAnswer = () => {
    setAnswers([...answers, { id: Date.now().toString(), text: '', imageUrl: '' }]);
  };

  const handleRemoveAnswer = (id: string) => {
    setAnswers(answers.filter(answer => answer.id !== id));
  };

  const handleAnswerImageUpload = (id: string, dataUrl: string) => {
    const newAnswers = answers.map(answer =>
      answer.id === id ? { ...answer, imageUrl: dataUrl } : answer
    );
    setAnswers(newAnswers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      text,
      imageUrl: imageData,
      subject,
      class: className,
      answers: answers.map(answer => ({
        ...answer,
        imageUrl: answer.imageUrl || undefined
      }))
    });

    if (!initialQuestion) {
      setText('');
      setImageData('');
      setSubject('');
      setClassName('');
      setAnswers([{ id: '1', text: '', imageUrl: '' }]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Question Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Question Image</label>
          <ImageUploader onImageUpload={setImageData} />
          {imageData && (
            <div className="mt-4">
              <DraggableImage src={imageData} alt="Question" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Class</label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Answers</h3>
            <Button
              type="button"
              onClick={handleAddAnswer}
              icon={PlusCircle}
            >
              Add Answer
            </Button>
          </div>

          {answers.map((answer, index) => (
            <div key={answer.id} className="space-y-2 p-4 border rounded-md">
              <div className="flex items-center justify-between">
                <span className="font-medium">Answer {index + 1}</span>
                {answers.length > 1 && (
                  <Button
                    type="button"
                    variant="danger"
                    icon={MinusCircle}
                    onClick={() => handleRemoveAnswer(answer.id)}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <input
                type="text"
                value={answer.text}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[index].text = e.target.value;
                  setAnswers(newAnswers);
                }}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Answer text"
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700">Answer Image</label>
                <ImageUploader onImageUpload={(dataUrl) => handleAnswerImageUpload(answer.id, dataUrl)} />
                {answer.imageUrl && (
                  <div className="mt-2">
                    <DraggableImage src={answer.imageUrl} alt={`Answer ${index + 1}`} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full">
        {initialQuestion ? 'Update' : 'Save'} Question
      </Button>
    </form>
  );
}