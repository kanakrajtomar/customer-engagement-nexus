
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Rule } from '@/types';
import { aiApi } from '@/services/api';
import { toast } from "@/components/ui/sonner";

interface NaturalLanguageInputProps {
  onRulesGenerated: (rules: Rule[]) => void;
}

export const NaturalLanguageInput: React.FC<NaturalLanguageInputProps> = ({ onRulesGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await aiApi.generateSegmentRules({ prompt });
      
      if (response.rules.length > 0) {
        onRulesGenerated(response.rules);
        setExplanation(response.explanation);
        toast.success("Rules generated successfully");
      } else {
        toast.error("Failed to generate rules from your prompt");
      }
    } catch (error) {
      console.error('Error generating rules:', error);
      toast.error("An error occurred while generating rules");
    } finally {
      setIsLoading(false);
    }
  };

  const examplePrompts = [
    "People who haven't shopped in 6 months and spent over ₹5K",
    "Customers who visited more than 5 times but spent less than ₹1000",
    "High-value customers who made purchases in the last 30 days"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Natural Language Segmentation</CardTitle>
        <CardDescription>
          Describe your target audience in plain language and our AI will convert it to rules
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. People who haven't shopped in 6 months and spent over ₹5K"
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate'}
            </Button>
          </div>
          
          {explanation && (
            <div className="p-4 bg-blue-50 rounded-md text-sm text-blue-800">
              <p className="font-medium mb-1">AI Explanation:</p>
              <p>{explanation}</p>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex-col items-start">
        <p className="text-sm text-gray-500 mb-2">Example prompts:</p>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((example, index) => (
            <Button 
              key={index} 
              variant="outline" 
              size="sm" 
              onClick={() => setPrompt(example)}
              className="text-xs"
            >
              {example}
            </Button>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};
