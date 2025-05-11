
import React from 'react';
import { Customer } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';

interface CustomerListProps {
  customers: Customer[];
  isLoading: boolean;
}

export const CustomerList: React.FC<CustomerListProps> = ({ customers, isLoading }) => {
  
  if (isLoading) {
    return (
      <Card>
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
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-medium mb-2">No customers found</h3>
          <p className="text-gray-500">
            You don't have any customers in your database yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Total Spend</TableHead>
                <TableHead>Last Purchase</TableHead>
                <TableHead className="text-center">Visits</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell className="text-right">₹{customer.total_spend.toLocaleString()}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(customer.last_purchase_date), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-center">{customer.visit_count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
