
import React from 'react';
import { Campaign } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface CampaignListProps {
  campaigns: Campaign[];
  isLoading: boolean;
}

export const CampaignList: React.FC<CampaignListProps> = ({ campaigns, isLoading }) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No campaigns yet</h3>
          <p className="text-gray-500 mb-4">
            Create your first campaign to start reaching out to your customers
          </p>
          <Button onClick={() => navigate('/campaigns/create')}>
            Create Campaign
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {campaigns.map(campaign => {
        const successRate = campaign.sent_count > 0 
          ? Math.round((campaign.sent_count / (campaign.sent_count + campaign.failed_count)) * 100) 
          : 0;
          
        return (
          <Card key={campaign.id} className="hover:shadow-md transition-shadow cursor-pointer" 
                onClick={() => navigate(`/campaigns/${campaign.id}`)}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{campaign.name}</h3>
                  <p className="text-gray-500 mt-1">{campaign.description}</p>
                </div>
                <div className="text-right">
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium
                    ${campaign.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      campaign.status === 'sending' ? 'bg-blue-100 text-blue-800' : 
                      campaign.status === 'failed' ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'}`
                  }>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-500">Audience Size</p>
                  <p className="text-xl font-semibold">{campaign.audience_size.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery Rate</p>
                  <p className="text-xl font-semibold">{successRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="text-sm font-medium">{formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true })}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
