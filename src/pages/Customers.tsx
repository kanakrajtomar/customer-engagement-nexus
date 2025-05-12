
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Customer } from '@/types';
import { customerApi } from '@/services/api';
import { CustomerList } from '@/components/customers/CustomerList';
import { Search, Upload, Download, Plus, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: customerApi.getCustomers
  });

  // Filter customers based on search query
  const filteredCustomers = searchQuery.trim() === ''
    ? customers
    : customers.filter(
        customer => 
          customer.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) || 
          customer.email.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          customer.phone.includes(searchQuery.trim())
      );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-all">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-all">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="shadow-sm hover:shadow-md transition-all bg-crm-blue hover:bg-crm-darkBlue">
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      <Card className="bg-white shadow-md border border-gray-100">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search customers by name, email or phone..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 border-gray-200 focus:border-crm-blue focus:ring-1 focus:ring-crm-lightBlue transition-all"
              />
            </div>
            <div className="flex-shrink-0">
              <Button variant="outline" size="icon" className="border-gray-200 hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <CustomerList 
        customers={filteredCustomers}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Customers;
