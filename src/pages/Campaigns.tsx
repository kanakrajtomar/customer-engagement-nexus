
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CampaignList } from '@/components/campaigns/CampaignList';
import { Campaign } from '@/types';
import { mockApi } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const Campaigns = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await mockApi.getCampaigns();
        setCampaigns(data);
        setFilteredCampaigns(data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    
    if (query === '') {
      setFilteredCampaigns(campaigns);
    } else {
      setFilteredCampaigns(
        campaigns.filter(
          campaign => 
            campaign.name.toLowerCase().includes(query) || 
            (campaign.description && campaign.description.toLowerCase().includes(query))
        )
      );
    }
  }, [searchQuery, campaigns]);

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
