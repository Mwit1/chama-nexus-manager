
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { 
  Users, 
  PiggyBank, 
  CreditCard, 
  Calendar, 
  ChartBar, 
  Bell 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const HomePage: React.FC = () => {
  // Define feature cards for the homepage
  const features = [
    {
      title: "Member Management",
      description: "Register members, manage profiles and track member status.",
      icon: <Users className="h-8 w-8 mb-4 text-primary" />,
      link: "/members"
    },
    {
      title: "Contribution Tracking",
      description: "Schedule and track regular contributions from all members.",
      icon: <PiggyBank className="h-8 w-8 mb-4 text-primary" />,
      link: "/contributions"
    },
    {
      title: "Loan Management",
      description: "Process loan applications, approvals and repayment tracking.",
      icon: <CreditCard className="h-8 w-8 mb-4 text-primary" />,
      link: "/loans"
    },
    {
      title: "Treasury Dashboard",
      description: "Overview of group funds, goals and financial performance.",
      icon: <PiggyBank className="h-8 w-8 mb-4 text-primary" />,
      link: "/treasury"
    },
    {
      title: "Reporting & Analytics",
      description: "Generate detailed reports on contributions, loans and performance.",
      icon: <ChartBar className="h-8 w-8 mb-4 text-primary" />,
      link: "/reports"
    },
    {
      title: "Meeting Management",
      description: "Schedule meetings, track attendance and store meeting minutes.",
      icon: <Calendar className="h-8 w-8 mb-4 text-primary" />,
      link: "/meetings"
    }
  ];

  return (
    <Layout>
      {/* Hero section */}
      <section className="bg-white shadow-md rounded-lg p-8 mb-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Chama Nexus
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            The complete management solution for group savings and investment clubs
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg">
              Get Started
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-center mb-8">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <Link to={feature.link} className="text-primary hover:underline mt-auto">
                Explore &rarr;
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How it works section */}
      <section className="bg-white shadow-md rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Set Up Your Group</h3>
            <p className="text-gray-600">Register your group, add members and define contribution plans</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Track Contributions</h3>
            <p className="text-gray-600">Record regular contributions and manage group funds</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Grow Together</h3>
            <p className="text-gray-600">Issue loans, track repayments and grow your group's wealth</p>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-primary text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to streamline your Chama operations?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Join thousands of groups already using Chama Nexus to manage their savings and investment clubs.
        </p>
        <Button variant="outline" className="bg-white text-primary hover:bg-gray-100">
          Start Free Trial
        </Button>
      </section>
    </Layout>
  );
};

export default HomePage;
