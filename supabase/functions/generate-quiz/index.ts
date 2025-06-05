
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Constraint {
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

const GEMINI_API_KEY = 'AIzaSyA-EF7zhW7KuQtrZLg-mBgvVxXka4kOgFg';
const GEMINI_MODEL = 'gemini-2.0-flash-latest';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { constraints }: { constraints: Constraint[] } = await req.json();
    
    if (!constraints || constraints.length === 0) {
      throw new Error('No constraints provided');
    }

    const prompt = createPrompt(constraints);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini response:', data);
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    const questions = parseQuestions(generatedText);
    
    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-quiz function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate quiz questions',
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function createPrompt(constraints: Constraint[]): string {
  let prompt = `Generate multiple choice questions (MCQs) based on the following constraints. Each question should be worth 1 mark.

Return the response in JSON format with the following structure:
{
  "questions": [
    {
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of why this is the correct answer"
    }
  ]
}

Constraints:
`;

  constraints.forEach((constraint, index) => {
    prompt += `
${index + 1}. Topic: ${constraint.topic}
   Difficulty: ${constraint.difficulty}
   Number of questions: ${constraint.numberOfQuestions}
`;
  });

  prompt += `
Important requirements:
- Each question must have exactly 4 options
- Only one option should be correct
- Provide a brief explanation for each correct answer
- Make sure questions are relevant to computer science topics like data structures, algorithms, operating systems, etc.
- For easy difficulty: Focus on basic concepts and definitions
- For medium difficulty: Include application-based questions
- For hard difficulty: Include complex analysis and problem-solving questions
- Return only the JSON response, no additional text`;

  return prompt;
}

function parseQuestions(generatedText: string): Question[] {
  try {
    // Clean the generated text to extract JSON
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const jsonText = jsonMatch[0];
    const parsed = JSON.parse(jsonText);
    
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Invalid response format');
    }
    
    return parsed.questions.map((q: any) => ({
      question: q.question || '',
      options: Array.isArray(q.options) ? q.options.slice(0, 4) : [],
      correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
      explanation: q.explanation || 'No explanation provided'
    }));
  } catch (error) {
    console.error('Error parsing questions:', error);
    // Fallback questions in case of parsing error
    return [
      {
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correctAnswer: 1,
        explanation: "Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity."
      }
    ];
  }
}
