
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RuleBuilder } from '@/components/segments/RuleBuilder';
import { NaturalLanguageInput } from '@/components/segments/NaturalLanguageInput';
import { Rule } from '@/types';
import { Tab } from '@headlessui/react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Segments = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  
  const handleRulesChange = (newRules: Rule[]) => {
    setRules(newRules);
  };

  const handleAIGeneration = (generatedRules: Rule[]) => {
    setRules(generatedRules);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Audience Segments</h1>
          <p className="text-gray-500 mt-1">
            Create and test audience segments before running campaigns
          </p>
        </div>
        <Button disabled={rules.length === 0}>
          Save Segment
        </Button>
      </div>

      <Tabs defaultValue="builder">
        <TabsList>
          <TabsTrigger value="builder">Rule Builder</TabsTrigger>
          <TabsTrigger value="natural">Natural Language</TabsTrigger>
        </TabsList>
        
        <TabsContent value="builder" className="pt-4">
          <RuleBuilder rules={rules} onChange={handleRulesChange} />
        </TabsContent>
        
        <TabsContent value="natural" className="pt-4">
          <NaturalLanguageInput onRulesGenerated={handleAIGeneration} />
          
          {rules.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Generated Rules</h3>
              <RuleBuilder rules={rules} onChange={handleRulesChange} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Segments;
