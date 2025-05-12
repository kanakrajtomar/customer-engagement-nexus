
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from "@/components/ui/card";
import { RuleBuilder } from '@/components/segments/RuleBuilder';
import { NaturalLanguageInput } from '@/components/segments/NaturalLanguageInput';
import { Campaign, Rule } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { campaignApi } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { MessageGenerator } from './MessageGenerator';
import { useMutation } from '@tanstack/react-query';

interface CampaignFormProps {
  initialCampaign?: Campaign;
}

export const CampaignForm: React.FC<CampaignFormProps> = ({ initialCampaign }) => {
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Partial<Campaign>>(
    initialCampaign || {
      name: '',
      description: '',
      rules: []
    }
  );
  
  const [message, setMessage] = useState<string>('');
  
  const createCampaignMutation = useMutation({
    mutationFn: (newCampaign: Partial<Campaign>) => campaignApi.createCampaign(newCampaign as any),
    onSuccess: () => {
      toast.success("Campaign created successfully!");
      navigate('/campaigns');
    },
    onError: (error) => {
      console.error('Error creating campaign:', error);
      toast.error("An error occurred while creating the campaign");
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCampaign({ ...campaign, [name]: value });
  };

  const handleRulesChange = (rules: Rule[]) => {
    setCampaign({ ...campaign, rules });
  };

  const handleMessageChange = (newMessage: string) => {
    setMessage(newMessage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!campaign.name) {
      toast.error("Campaign name is required");
      return;
    }

    if (!campaign.rules || campaign.rules.length === 0) {
      toast.error("Please add at least one rule to your segment");
      return;
    }

    if (!message) {
      toast.error("Please enter a message for your campaign");
      return;
    }

    try {
      // Get audience size preview
      const audiencePreview = await campaignApi.previewAudience(campaign.rules || []);
      
      // Create the campaign with audience size
      createCampaignMutation.mutate({
        ...campaign,
        audience_size: audiencePreview.size
      });
      
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error("An error occurred while previewing audience");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Name
              </label>
              <Input
                id="name"
                name="name"
                value={campaign.name || ''}
                onChange={handleChange}
                placeholder="Enter campaign name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={campaign.description || ''}
                onChange={handleChange}
                placeholder="Enter campaign description"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="builder">
        <TabsList className="mb-4">
          <TabsTrigger value="builder">Rule Builder</TabsTrigger>
          <TabsTrigger value="natural">Natural Language</TabsTrigger>
        </TabsList>
        
        <TabsContent value="builder">
          <RuleBuilder rules={campaign.rules || []} onChange={handleRulesChange} />
        </TabsContent>
        
        <TabsContent value="natural">
          <NaturalLanguageInput onRulesGenerated={handleRulesChange} />
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Message
            </label>
            <MessageGenerator onChange={handleMessageChange} campaignName={campaign.name || ''} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/campaigns')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={createCampaignMutation.isPending}
        >
          {createCampaignMutation.isPending ? 'Creating...' : 'Create Campaign'}
        </Button>
      </div>
    </form>
  );
};
