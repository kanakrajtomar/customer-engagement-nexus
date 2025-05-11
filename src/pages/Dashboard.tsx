
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockApi } from '@/services/api';
import { Campaign, Customer } from '@/types';
import { CampaignList } from '@/components/campaigns/CampaignList';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campaignsData, customersData] = await Promise.all([
          mockApi.getCampaigns(),
          mockApi.getCustomers()
        ]);
        
        setCampaigns(campaignsData);
        setCustomers(customersData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const recentCampaigns = campaigns.slice(0, 3);
  const totalCustomers = customers.length;
  const totalSpent = customers.reduce((sum, customer) => sum + customer.total_spend, 0);
  
  // Calculate active customers (visited in last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const activeCustomers = customers.filter(
    customer => new Date(customer.last_purchase_date) > thirtyDaysAgo
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={() => navigate('/campaigns/create')}>
          Create Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Customers</CardDescription>
            <CardTitle className="text-3xl">
              {isLoading ? '...' : totalCustomers.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              {isLoading ? '...' : `${activeCustomers.toLocaleString()} active in the last 30 days`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl">
              {isLoading ? '...' : `₹${totalSpent.toLocaleString()}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              {isLoading ? '...' : `Avg ₹${Math.round(totalSpent / totalCustomers).toLocaleString()} per customer`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Campaigns</CardDescription>
            <CardTitle className="text-3xl">
              {isLoading ? '...' : campaigns.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              {isLoading ? '...' : campaigns.filter(c => c.status === 'completed').length} completed
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent Campaigns</h2>
          <Button variant="ghost" onClick={() => navigate('/campaigns')}>
            View all
          </Button>
        </div>
        <CampaignList campaigns={recentCampaigns} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Dashboard;
