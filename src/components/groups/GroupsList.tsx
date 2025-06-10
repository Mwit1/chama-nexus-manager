
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, ArrowRight } from "lucide-react";
import { Group } from '@/hooks/useGroups';

interface GroupsListProps {
  groups: Group[];
  loading: boolean;
  onRefresh: () => void;
}

const GroupsList: React.FC<GroupsListProps> = ({ groups, loading, onRefresh }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users className="h-12 w-12 text-gray-400" />
          </div>
          <CardTitle className="text-xl mb-2">No groups yet</CardTitle>
          <CardDescription className="mb-4">
            Create your first chama group to get started with managing members and contributions.
          </CardDescription>
          <Button onClick={onRefresh} variant="outline">
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => (
        <Card key={group.id} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{group.name}</CardTitle>
                <CardDescription className="mt-1">
                  {group.description || 'No description'}
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {group.member_count} members
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Created {new Date(group.created_at).toLocaleDateString()}
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                {group.member_count} {group.member_count === 1 ? 'member' : 'members'}
              </div>
              
              <Button 
                className="w-full mt-4"
                onClick={() => navigate(`/group-members/${group.id}`)}
              >
                Manage Members
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GroupsList;
