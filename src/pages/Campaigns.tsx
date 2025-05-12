
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CampaignList } from '@/components/campaigns/CampaignList';
import { Campaign } from '@/types';
import { campaignApi } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const Campaigns = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: campaignApi.getCampaigns
  });

  // Filter campaigns based on search query
  const filteredCampaigns = searchQuery.trim() === ''
    ? campaigns
    : campaigns.filter(
        campaign => 
          campaign.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) || 
          (campaign.description && campaign.description.toLowerCase().includes(searchQuery.toLowerCase().trim()))
      );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <Button onClick={() => navigate('/campaigns/create')}>
          Create Campaign
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        <div className="flex-shrink-0">
          <Button variant="outline">Filter</Button>
        </div>
      </div>
      
      <CampaignList 
        campaigns={filteredCampaigns}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Campaigns;
