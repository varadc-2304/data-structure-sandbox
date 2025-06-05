
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateQuizQuestions } from '@/utils/geminiApi';

interface Constraint {
  id: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  numberOfQuestions: number;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type QuizStep = 'setup' | 'quiz' | 'results';

const QuizDialog: React.FC<QuizDialogProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<QuizStep>('setup');
  const [constraints, setConstraints] = useState<Constraint[]>([
    { id: '1', topic: '', difficulty: 'easy', numberOfQuestions: 5 }
  ]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addConstraint = () => {
    const newConstraint: Constraint = {
      id: Date.now().toString(),
      topic: '',
      difficulty: 'easy',
      numberOfQuestions: 5
    };
    setConstraints([...constraints, newConstraint]);
  };

  const removeConstraint = (id: string) => {
    setConstraints(constraints.filter(c => c.id !== id));
  };

  const updateConstraint = (id: string, field: keyof Constraint, value: any) => {
    setConstraints(constraints.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const generateQuiz = async () => {
    const validConstraints = constraints.filter(c => c.topic.trim() !== '');
    if (validConstraints.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please add at least one constraint with a topic."
      });
      return;
    }

    setIsLoading(true);
    try {
      const generatedQuestions = await generateQuizQuestions(validConstraints);
      setQuestions(generatedQuestions);
      setUserAnswers(new Array(generatedQuestions.length).fill(-1));
      setStep('quiz');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate quiz questions. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const submitQuiz = () => {
    setStep('results');
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return { correct, total: questions.length };
  };

  const resetQuiz = () => {
    setStep('setup');
    setConstraints([{ id: '1', topic: '', difficulty: 'easy', numberOfQuestions: 5 }]);
    setQuestions([]);
    setUserAnswers([]);
  };

  const handleClose = () => {
    resetQuiz();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'setup' && 'Quiz Setup'}
            {step === 'quiz' && 'Quiz Questions'}
            {step === 'results' && 'Quiz Results'}
          </DialogTitle>
        </DialogHeader>

        {step === 'setup' && (
          <div className="space-y-4">
            <div className="space-y-4">
              {constraints.map((constraint, index) => (
                <div key={constraint.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Constraint {index + 1}</h3>
                    {constraints.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeConstraint(constraint.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm font-medium">Topic</label>
                      <Input
                        placeholder="e.g., Data Structures, Algorithms"
                        value={constraint.topic}
                        onChange={(e) => updateConstraint(constraint.id, 'topic', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Difficulty</label>
                      <Select
                        value={constraint.difficulty}
                        onValueChange={(value) => updateConstraint(constraint.id, 'difficulty', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Number of Questions</label>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={constraint.numberOfQuestions}
                        onChange={(e) => updateConstraint(constraint.id, 'numberOfQuestions', parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={addConstraint}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Constraint
            </Button>

            <Button
              onClick={generateQuiz}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Quiz...
                </>
              ) : (
                'Generate Quiz'
              )}
            </Button>
          </div>
        )}

        {step === 'quiz' && (
          <div className="space-y-6">
            {questions.map((question, questionIndex) => (
              <div key={questionIndex} className="p-4 border rounded-lg space-y-3">
                <h3 className="font-medium">
                  Question {questionIndex + 1}: {question.question}
                </h3>
                
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        value={optionIndex}
                        checked={userAnswers[questionIndex] === optionIndex}
                        onChange={() => {
                          const newAnswers = [...userAnswers];
                          newAnswers[questionIndex] = optionIndex;
                          setUserAnswers(newAnswers);
                        }}
                        className="text-drona-green"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <Button onClick={submitQuiz} className="w-full">
              Submit Quiz
            </Button>
          </div>
        )}

        {step === 'results' && (
          <div className="space-y-6">
            <div className="text-center p-6 bg-drona-green/10 rounded-lg">
              <h2 className="text-2xl font-bold text-drona-green">Your Score</h2>
              <p className="text-3xl font-bold mt-2">
                {calculateScore().correct} / {calculateScore().total}
              </p>
              <p className="text-lg mt-2">
                {Math.round((calculateScore().correct / calculateScore().total) * 100)}%
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Question Review</h3>
              {questions.map((question, index) => {
                const isCorrect = userAnswers[index] === question.correctAnswer;
                return (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <h4 className="font-medium">
                      Question {index + 1}: {question.question}
                    </h4>
                    
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-2 rounded ${
                            optionIndex === question.correctAnswer
                              ? 'bg-green-100 border-green-500'
                              : userAnswers[index] === optionIndex && !isCorrect
                              ? 'bg-red-100 border-red-500'
                              : 'bg-gray-50'
                          }`}
                        >
                          <span className="flex items-center">
                            {optionIndex === question.correctAnswer && '✓ '}
                            {userAnswers[index] === optionIndex && !isCorrect && '✗ '}
                            {option}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3 p-3 bg-blue-50 rounded">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  </div>
                );
              })}
            </div>

            <Button onClick={resetQuiz} className="w-full">
              Take Another Quiz
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuizDialog;
