
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { aiApi, mockApi } from '@/services/api';
import { toast } from '@/components/ui/sonner';

interface MessageGeneratorProps {
  onChange: (message: string) => void;
  campaignName: string;
}

export const MessageGenerator: React.FC<MessageGeneratorProps> = ({ onChange, campaignName }) => {
  const [message, setMessage] = useState<string>('');
  const [objective, setObjective] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Update parent component when message changes
  useEffect(() => {
    onChange(message);
  }, [message, onChange]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const generateSuggestions = async () => {
    if (!objective.trim()) {
      toast.error('Please enter a campaign objective');
      return;
    }

    try {
      setIsLoading(true);
      // In a real app, this would call an AI service
      const response = await mockApi.generateMessageSuggestions({
        campaignObjective: objective
      });

      setSuggestions(response.messages);
      toast.success('Message suggestions generated');
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast.error('Failed to generate message suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setMessage(suggestion);
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={message}
        onChange={handleMessageChange}
        placeholder="Enter your campaign message. Use {name} to personalize with customer name."
        rows={4}
      />

      <div className="border-t pt-4">
        <p className="text-sm font-medium mb-2">Need inspiration? Let AI help you craft the perfect message</p>
        
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="Enter campaign objective (e.g., 'bring back inactive users')"
            className="flex-1 px-3 py-2 border rounded-md"
          />
          <Button
            onClick={generateSuggestions}
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Ideas'}
          </Button>
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">AI Suggestions:</p>
            <div className="grid gap-2">
              {suggestions.map((suggestion, index) => (
                <Card 
                  key={index} 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <CardContent className="p-3">
                    <p className="text-sm">{suggestion}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
