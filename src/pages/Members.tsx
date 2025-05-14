
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { UserPlus, Search } from "lucide-react";

const Members: React.FC = () => {
  // Mock data for members
  const members = [
    { id: 1, name: 'John Doe', phone: '+254712345678', role: 'Admin', status: 'Active', joined: '12 Jan 2023', contributions: '$2,400' },
    { id: 2, name: 'Jane Smith', phone: '+254723456789', role: 'Treasurer', status: 'Active', joined: '15 Jan 2023', contributions: '$1,850' },
    { id: 3, name: 'Michael Johnson', phone: '+254734567890', role: 'Member', status: 'Active', joined: '18 Jan 2023', contributions: '$1,200' },
    { id: 4, name: 'Sara Williams', phone: '+254745678901', role: 'Member', status: 'Inactive', joined: '21 Jan 2023', contributions: '$950' },
    { id: 5, name: 'Robert Brown', phone: '+254756789012', role: 'Member', status: 'Suspended', joined: '24 Jan 2023', contributions: '$750' },
  ];

  return (
    <Layout>
      <div className="bg-white shadow-md rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Members</h1>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add Member
          </Button>
        </div>
        
        {/* Search and filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search members..." 
              className="pl-10" 
            />
          </div>
          <select className="border border-gray-300 rounded-md px-4 py-2">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <select className="border border-gray-300 rounded-md px-4 py-2">
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="treasurer">Treasurer</option>
            <option value="member">Member</option>
          </select>
        </div>
        
        {/* Members table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Total Contributions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.status === 'Active' ? 'bg-green-100 text-green-800' :
                      member.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {member.status}
                    </span>
                  </TableCell>
                  <TableCell>{member.joined}</TableCell>
                  <TableCell>{member.contributions}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default Members;
