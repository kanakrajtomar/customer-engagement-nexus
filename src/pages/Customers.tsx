
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Customer } from '@/types';
import { mockApi } from '@/services/api';
import { CustomerList } from '@/components/customers/CustomerList';
import { Search, Upload, Download } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await mockApi.getCustomers();
        setCustomers(data);
        setFilteredCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    
    if (query === '') {
      setFilteredCustomers(customers);
    } else {
      setFilteredCustomers(
        customers.filter(
          customer => 
            customer.name.toLowerCase().includes(query) || 
            customer.email.toLowerCase().includes(query) ||
            customer.phone.includes(query)
        )
      );
    }
  }, [searchQuery, customers]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customers</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search customers by name, email or phone..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
            <div className="flex-shrink-0">
              <Button variant="outline">Filter</Button>
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
