
import React from 'react';
import { CampaignForm } from '@/components/campaigns/CampaignForm';

const CampaignCreate = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Campaign</h1>
        <p className="text-gray-500 mt-2">
          Define your audience and create a targeted campaign
        </p>
      </div>
      
      <CampaignForm />
    </div>
  );
};

export default CampaignCreate;
