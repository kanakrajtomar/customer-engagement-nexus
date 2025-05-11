
import React, { useState, useEffect } from 'react';
import { Rule } from '@/types';
import { Button } from '@/components/ui/button';
import { RuleGroup } from './RuleGroup';
import { Card, CardContent } from '@/components/ui/card';
import { campaignApi, mockApi } from '@/services/api';

interface RuleBuilderProps {
  rules: Rule[];
  onChange: (rules: Rule[]) => void;
}

export const RuleBuilder: React.FC<RuleBuilderProps> = ({ rules, onChange }) => {
  const [audienceSize, setAudienceSize] = useState<number | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const handleRulesChange = (newRules: Rule[]) => {
    onChange(newRules);
  };

  const handleAddGroup = () => {
    const newRule: Rule = {
      id: crypto.randomUUID(),
      type: 'group',
      combinator: 'AND',
      rules: []
    };
    onChange([...rules, newRule]);
  };

  const handleAddCondition = () => {
    const newRule: Rule = {
      id: crypto.randomUUID(),
      type: 'condition',
      field: 'total_spend',
      operator: '>',
      value: 0
    };
    onChange([...rules, newRule]);
  };

  const handlePreviewAudience = async () => {
    try {
      setIsPreviewLoading(true);
      // In a real app, this would call the API
      const result = await mockApi.previewAudience(rules);
      setAudienceSize(result.size);
    } catch (error) {
      console.error('Failed to preview audience:', error);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // Preview audience when rules change, with debounce
  useEffect(() => {
    if (rules.length === 0) {
      setAudienceSize(null);
      return;
    }

    const timer = setTimeout(handlePreviewAudience, 500);
    return () => clearTimeout(timer);
  }, [rules]);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Segment Rules</h3>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddCondition}
                >
                  Add Condition
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddGroup}
                >
                  Add Group
                </Button>
              </div>
            </div>
            
            {rules.length > 0 ? (
              <div className="border rounded-md p-4 bg-white">
                {rules.map((rule) => (
                  <RuleGroup
                    key={rule.id}
                    rule={rule}
                    parentRules={rules}
                    onChange={handleRulesChange}
                    onDelete={(ruleId) => {
                      onChange(rules.filter((r) => r.id !== ruleId));
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="border rounded-md p-4 bg-white text-center text-gray-500">
                No rules added yet. Add a condition or group to start building your segment.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <div>
          <Button 
            variant="outline" 
            onClick={handlePreviewAudience} 
            disabled={isPreviewLoading || rules.length === 0}
          >
            {isPreviewLoading ? 'Loading...' : 'Preview Audience'}
          </Button>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Estimated audience size:</p>
          <p className="text-3xl font-bold">
            {audienceSize !== null ? audienceSize : '-'}
          </p>
        </div>
      </div>
    </div>
  );
};
