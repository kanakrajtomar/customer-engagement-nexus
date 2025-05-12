
import React from 'react';
import { Customer } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomerListProps {
  customers: Customer[];
  isLoading: boolean;
}

export const CustomerList: React.FC<CustomerListProps> = ({ customers, isLoading }) => {
  
  const getSpendClass = (spend: number) => {
    if (spend >= 15000) return "bg-green-100 text-green-800";
    if (spend >= 8000) return "bg-blue-100 text-blue-800";
    if (spend >= 3000) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };
  
  if (isLoading) {
    return (
      <Card className="shadow-md border border-gray-100">
        <CardContent className="p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (customers.length === 0) {
    return (
      <Card className="shadow-md border border-gray-100">
        <CardContent className="p-12 text-center">
          <h3 className="text-lg font-medium mb-2 text-gray-800">No customers found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            We couldn't find any customers matching your search criteria. Try adjusting your filters or add a new customer.
          </p>
          <Button className="mt-4 bg-crm-blue hover:bg-crm-darkBlue">
            Add New Customer
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md border border-gray-100">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200">
                <TableHead className="font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center">
                    Name
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">Email</TableHead>
                <TableHead className="font-semibold text-gray-700">Phone</TableHead>
                <TableHead className="text-right font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center justify-end">
                    Total Spend
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center">
                    Last Purchase
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-center font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center justify-center">
                    Visits
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow 
                  key={customer.id} 
                  className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                >
                  <TableCell className="font-medium text-gray-800">{customer.name}</TableCell>
                  <TableCell className="text-gray-600">{customer.email}</TableCell>
                  <TableCell className="text-gray-600">{customer.phone}</TableCell>
                  <TableCell className="text-right">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getSpendClass(customer.total_spend)}`}>
                      ₹{customer.total_spend.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDistanceToNow(new Date(customer.last_purchase_date), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-gray-100">
                      {customer.visit_count}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
