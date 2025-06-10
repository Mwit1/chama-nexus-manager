
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Crown, Calculator } from "lucide-react";
import { AllMember } from '@/hooks/useAllMembers';

interface MembersOverviewProps {
  members: AllMember[];
  loading: boolean;
}

const MembersOverview: React.FC<MembersOverviewProps> = ({ members, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'Active').length;
  const adminMembers = members.filter(m => m.role === 'admin').length;
  const treasurerMembers = members.filter(m => m.role === 'treasurer').length;

  const stats = [
    {
      title: "Total Members",
      value: totalMembers,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Members",
      value: activeMembers,
      icon: UserCheck,
      color: "text-green-600"
    },
    {
      title: "Admins",
      value: adminMembers,
      icon: Crown,
      color: "text-purple-600"
    },
    {
      title: "Treasurers",
      value: treasurerMembers,
      icon: Calculator,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MembersOverview;
