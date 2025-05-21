'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { User } from '@/services/api';
import { Check, Crown, Zap } from 'lucide-react';
import { useState } from 'react';

interface ProfilePlanProps {
  user: User;
}

export function ProfilePlan({ user }: ProfilePlanProps) {
  const [isUpgrading, setIsUpgrading] = useState(false);

  const plans = [
    {
      name: 'Free',
      description: 'Basic access to document analysis',
      price: '$0',
      period: 'forever',
      features: [
        '5 documents per month',
        '100 questions per month',
        '50MB storage limit',
        'Standard response time',
      ],
      isCurrent: user.plan === 'free',
      color: 'slate',
      icon: null,
    },
    {
      name: 'Pro',
      description: 'Enhanced features for professionals',
      price: '$12',
      period: 'per month',
      features: [
        'Unlimited documents',
        'Unlimited questions',
        '2GB storage limit',
        'Priority response time',
        'Advanced document analysis',
        'Export to PDF/Word',
      ],
      isCurrent: user.plan === 'pro',
      color: 'purple',
      icon: <Zap className="h-5 w-5" />,
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'Custom solutions for teams',
      price: '$49',
      period: 'per month',
      features: [
        'Everything in Pro',
        '10GB storage limit',
        'Team collaboration',
        'API access',
        'Custom integrations',
        'Dedicated support',
      ],
      isCurrent: user.plan === 'enterprise',
      color: 'amber',
      icon: <Crown className="h-5 w-5" />,
    },
  ];

  const handleUpgrade = (planName: string) => {
    setIsUpgrading(true);
    // In a real app, you would redirect to a payment page
    setTimeout(() => {
      setIsUpgrading(false);
      alert(
        `Upgrade to ${planName} plan initiated. This would redirect to payment in a real app.`
      );
    }, 1500);
  };

  return (
    <Card className="glass border-slate-700">
      <CardHeader>
        <CardTitle>Subscription Plan</CardTitle>
        <CardDescription>Manage your subscription and billing</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`glass border-slate-700 h-full flex flex-col ${
                plan.popular ? 'ring-2 ring-purple-500/50' : ''
              }`}
            >
              <Card
                className={`glass border-slate-700 h-full flex flex-col ${
                  plan.isCurrent ? 'bg-slate-800/50' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        {plan.icon && (
                          <span className="mr-2 text-purple-400">
                            {plan.icon}
                          </span>
                        )}
                        {plan.name}
                      </CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                    {plan.popular && (
                      <Badge className="bg-purple-600 hover:bg-purple-700">
                        Popular
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="mb-4">
                    <span className="text-2xl font-bold">{plan.price}</span>
                    <span className="text-gray-400 text-sm">
                      {' '}
                      {plan.period}
                    </span>
                  </div>

                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={
                      plan.isCurrent
                        ? 'bg-slate-700 text-white cursor-default'
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                    }
                    disabled={plan.isCurrent || isUpgrading}
                    onClick={() => handleUpgrade(plan.name)}
                  >
                    {plan.isCurrent
                      ? 'Current Plan'
                      : `Upgrade to ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-4 border border-slate-700 rounded-lg bg-slate-800/30">
          <h3 className="text-sm font-medium mb-2">Billing Information</h3>
          <p className="text-gray-400 text-sm">
            {user.plan === 'free'
              ? 'You are currently on the Free plan with no billing information on file.'
              : 'Your next billing date is on the 15th of next month. You can cancel anytime.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
