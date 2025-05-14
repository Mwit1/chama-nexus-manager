
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, ChevronRight, FileText, CheckCircle } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const Meetings: React.FC = () => {
  // Mock data for upcoming meetings
  const upcomingMeetings = [
    {
      id: 1,
      title: 'Monthly Review Meeting',
      date: 'May 28, 2023',
      time: '2:00 PM - 4:00 PM',
      location: 'Community Hall, Nairobi',
      agenda: 'Monthly contribution review, Loan approvals, New member applications',
      attendees: 15
    },
    {
      id: 2,
      title: 'Investment Strategy Meeting',
      date: 'June 15, 2023',
      time: '3:00 PM - 5:00 PM',
      location: 'Virtual Meeting (Zoom)',
      agenda: 'Review investment options, Vote on new investment proposals',
      attendees: 12
    },
    {
      id: 3,
      title: 'Quarterly Financial Review',
      date: 'July 2, 2023',
      time: '1:00 PM - 3:30 PM',
      location: 'Community Hall, Nairobi',
      agenda: 'Q2 financial review, Budget adjustments, Member status updates',
      attendees: 15
    }
  ];
  
  // Mock data for past meetings
  const pastMeetings = [
    {
      id: 1,
      title: 'Monthly Review Meeting',
      date: 'April 30, 2023',
      attendees: 14,
      minutesAvailable: true
    },
    {
      id: 2,
      title: 'Emergency Loan Review',
      date: 'April 15, 2023',
      attendees: 10,
      minutesAvailable: true
    },
    {
      id: 3,
      title: 'Monthly Review Meeting',
      date: 'March 26, 2023',
      attendees: 13,
      minutesAvailable: true
    },
    {
      id: 4,
      title: 'Investment Planning',
      date: 'March 12, 2023',
      attendees: 12,
      minutesAvailable: false
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Meetings</h1>
          <Button className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Meeting
          </Button>
        </div>
        
        {/* Upcoming meetings */}
        <h2 className="text-xl font-semibold">Upcoming Meetings</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {upcomingMeetings.map((meeting) => (
            <Card key={meeting.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{meeting.title}</CardTitle>
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">Upcoming</span>
                </div>
                <CardDescription>{meeting.agenda}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-2 mb-auto">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    {meeting.date}
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    {meeting.time}
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    {meeting.attendees} attendees expected
                  </div>
                  <div className="text-sm mt-1">
                    <strong>Location:</strong> {meeting.location}
                  </div>
                </div>
                
                <div className="mt-4 space-x-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button size="sm">Confirm Attendance</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Past meetings */}
        <Card>
          <CardHeader>
            <CardTitle>Past Meetings</CardTitle>
            <CardDescription>Access records and minutes from previous meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Meeting</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Attendees</TableHead>
                  <TableHead>Minutes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pastMeetings.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell className="font-medium">{meeting.title}</TableCell>
                    <TableCell>{meeting.date}</TableCell>
                    <TableCell>{meeting.attendees} members</TableCell>
                    <TableCell>
                      {meeting.minutesAvailable ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Available
                        </span>
                      ) : (
                        <span className="text-gray-500">Pending</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Meeting resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Templates</CardTitle>
              <CardDescription>Standard documents for meeting management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Standard Meeting Agenda</span>
                  </div>
                  <Button variant="ghost" size="sm">Download</Button>
                </div>
                <div className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Meeting Minutes Template</span>
                  </div>
                  <Button variant="ghost" size="sm">Download</Button>
                </div>
                <div className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Attendance Record Sheet</span>
                  </div>
                  <Button variant="ghost" size="sm">Download</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Meeting Guidelines</CardTitle>
              <CardDescription>Best practices for effective meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Preparing for a Meeting</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    <li>Distribute agenda at least 3 days before the meeting</li>
                    <li>Remind members 24 hours before the meeting</li>
                    <li>Prepare all necessary documents and reports</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-1">During the Meeting</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    <li>Record attendance as members arrive</li>
                    <li>Follow the agenda items in order</li>
                    <li>Document all decisions and action items</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-1">After the Meeting</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    <li>Share minutes within 48 hours</li>
                    <li>Follow up on action items</li>
                    <li>Begin planning for the next meeting</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Meetings;
