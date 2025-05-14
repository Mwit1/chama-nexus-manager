
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar, Download, Calendar } from "lucide-react";

const Reports: React.FC = () => {
  // Mock data for available reports
  const availableReports = [
    {
      id: 1, 
      title: 'Member Contribution Summary', 
      description: 'Detailed breakdown of contributions by each member',
      lastGenerated: '12 May 2023'
    },
    {
      id: 2, 
      title: 'Loan Distribution Report', 
      description: 'Overview of all loans, statuses, and repayments',
      lastGenerated: '10 May 2023'
    },
    {
      id: 3, 
      title: 'Financial Statement', 
      description: 'Complete financial statement with income, expenses, and balances',
      lastGenerated: '05 May 2023'
    },
    {
      id: 4, 
      title: 'Member Performance Report', 
      description: 'Analysis of member activity, contributions, and loan repayments',
      lastGenerated: '01 May 2023'
    },
    {
      id: 5, 
      title: 'Meeting Attendance Report', 
      description: 'Summary of meeting attendance for all members',
      lastGenerated: '28 Apr 2023'
    },
    {
      id: 6, 
      title: 'Audit Trail', 
      description: 'Detailed log of all system activities and changes',
      lastGenerated: '25 Apr 2023'
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        
        {/* Report generation options */}
        <Card>
          <CardHeader>
            <CardTitle>Generate New Report</CardTitle>
            <CardDescription>Select parameters to generate a custom report</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="contributions">Contribution Summary</option>
                  <option value="loans">Loan Distribution</option>
                  <option value="financial">Financial Statement</option>
                  <option value="performance">Member Performance</option>
                  <option value="attendance">Meeting Attendance</option>
                  <option value="audit">Audit Trail</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <div className="flex items-center gap-2">
                  <input type="date" className="flex-1 border border-gray-300 rounded-md px-3 py-2" />
                  <span>to</span>
                  <input type="date" className="flex-1 border border-gray-300 rounded-md px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                <div className="flex gap-2">
                  <label className="flex items-center">
                    <input type="radio" name="format" value="pdf" className="mr-1" defaultChecked />
                    PDF
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="format" value="excel" className="mr-1" />
                    Excel
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="format" value="csv" className="mr-1" />
                    CSV
                  </label>
                </div>
              </div>
            </div>
            <Button className="flex items-center gap-2">
              <ChartBar className="h-4 w-4" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
        
        {/* Available reports */}
        <h2 className="text-xl font-semibold">Available Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableReports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="h-4 w-4 mr-1" />
                  Last generated: {report.lastGenerated}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    PDF
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Scheduled reports */}
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Reports</CardTitle>
            <CardDescription>Configure reports to be generated automatically</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <h4 className="font-medium">Monthly Financial Statement</h4>
                  <p className="text-sm text-gray-500">Generated on the 1st of every month</p>
                </div>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <h4 className="font-medium">Weekly Contribution Summary</h4>
                  <p className="text-sm text-gray-500">Generated every Monday morning</p>
                </div>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
              <Button className="w-full">Schedule New Report</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Reports;
