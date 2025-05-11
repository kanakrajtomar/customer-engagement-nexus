
import React from 'react';
import { Rule } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface RuleGroupProps {
  rule: Rule;
  parentRules: Rule[];
  onChange: (rules: Rule[]) => void;
  onDelete: (id: string) => void;
}

export const RuleGroup: React.FC<RuleGroupProps> = ({ rule, parentRules, onChange, onDelete }) => {
  const fieldOptions = [
    { value: 'name', label: 'Customer Name' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'total_spend', label: 'Total Spend' },
    { value: 'last_purchase_date', label: 'Days Since Last Purchase' },
    { value: 'visit_count', label: 'Visit Count' }
  ];

  const operatorOptions = [
    { value: '=', label: 'Equals' },
    { value: '!=', label: 'Not Equals' },
    { value: '>', label: 'Greater Than' },
    { value: '<', label: 'Less Than' },
    { value: '>=', label: 'Greater Than or Equal' },
    { value: '<=', label: 'Less Than or Equal' },
    { value: 'contains', label: 'Contains' },
    { value: 'not_contains', label: 'Does Not Contain' }
  ];

  const combinatorOptions = [
    { value: 'AND', label: 'AND' },
    { value: 'OR', label: 'OR' }
  ];

  const updateRule = (ruleId: string, updates: Partial<Rule>) => {
    const updatedRules = updateRuleInList(parentRules, ruleId, updates);
    onChange(updatedRules);
  };

  const updateRuleInList = (rules: Rule[], ruleId: string, updates: Partial<Rule>): Rule[] => {
    return rules.map(r => {
      if (r.id === ruleId) {
        return { ...r, ...updates };
      }
      if (r.type === 'group' && r.rules) {
        return {
          ...r,
          rules: updateRuleInList(r.rules, ruleId, updates)
        };
      }
      return r;
    });
  };

  const handleAddCondition = (parentRuleId: string) => {
    const newCondition: Rule = {
      id: crypto.randomUUID(),
      type: 'condition',
      field: 'total_spend',
      operator: '>',
      value: 0
    };
    
    updateRule(parentRuleId, {
      rules: [...(rule.rules || []), newCondition]
    });
  };

  const handleDeleteNestedRule = (parentRuleId: string, ruleId: string) => {
    if (rule.id === parentRuleId && rule.rules) {
      updateRule(parentRuleId, {
        rules: rule.rules.filter(r => r.id !== ruleId)
      });
    }
  };

  if (rule.type === 'condition') {
    return (
      <div className="rule-block flex items-center space-x-2">
        <Select
          defaultValue={rule.field}
          onValueChange={(value) => updateRule(rule.id, { field: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select field" />
          </SelectTrigger>
          <SelectContent>
            {fieldOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          defaultValue={rule.operator}
          onValueChange={(value) => updateRule(rule.id, { operator: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select operator" />
          </SelectTrigger>
          <SelectContent>
            {operatorOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="text"
          value={rule.value?.toString() || ''}
          onChange={(e) => updateRule(rule.id, { value: e.target.value })}
          className="w-[180px]"
          placeholder="Value"
        />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(rule.id)}
          className="text-red-500 hover:text-red-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (rule.type === 'group') {
    return (
      <div className="rule-block">
        <div className="flex justify-between items-center mb-2">
          <Select
            value={rule.combinator || 'AND'}
            onValueChange={(value) => updateRule(rule.id, { combinator: value as 'AND' | 'OR' })}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {combinatorOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddCondition(rule.id)}
            >
              Add Condition
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(rule.id)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="condition-group">
          {rule.rules && rule.rules.length > 0 ? (
            rule.rules.map((nestedRule) => (
              <RuleGroup
                key={nestedRule.id}
                rule={nestedRule}
                parentRules={rule.rules || []}
                onChange={(newRules) => updateRule(rule.id, { rules: newRules })}
                onDelete={(ruleId) => handleDeleteNestedRule(rule.id, ruleId)}
              />
            ))
          ) : (
            <div className="text-gray-400 text-sm p-2">
              Add a condition to this group
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
