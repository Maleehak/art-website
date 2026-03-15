"use client";

import { useState } from "react";
import {
  Package,
  DollarSign,
  Eye,
  TrendingUp,
  CheckCircle,
  Clock,
  Truck,
} from "lucide-react";

interface DashboardOrder {
  id: string;
  customer: string;
  email: string;
  artwork: string;
  amount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  date: string;
}

const PLACEHOLDER_ORDERS: DashboardOrder[] = [
  {
    id: "ORD-001",
    customer: "Sarah Ahmed",
    email: "sarah@example.com",
    artwork: "The Edge of Seeing",
    amount: 4075,
    status: "delivered",
    date: "2024-12-10",
  },
  {
    id: "ORD-002",
    customer: "Michael Chen",
    email: "m.chen@example.com",
    artwork: "Luminescence",
    amount: 1698,
    status: "shipped",
    date: "2024-12-18",
  },
  {
    id: "ORD-003",
    customer: "Fatima Khan",
    email: "fatima@example.com",
    artwork: "Standstill",
    amount: 2038,
    status: "confirmed",
    date: "2024-12-22",
  },
  {
    id: "ORD-004",
    customer: "James Wilson",
    email: "j.wilson@example.com",
    artwork: "Passing Lights",
    amount: 2038,
    status: "pending",
    date: "2024-12-28",
  },
];

const STATUS_CONFIG = {
  pending: { icon: Clock, color: "text-amber-600 bg-amber-50", label: "Pending" },
  confirmed: { icon: CheckCircle, color: "text-blue-600 bg-blue-50", label: "Confirmed" },
  shipped: { icon: Truck, color: "text-purple-600 bg-purple-50", label: "Shipped" },
  delivered: { icon: Package, color: "text-green-600 bg-green-50", label: "Delivered" },
};

export default function AdminPage() {
  const [orders] = useState<DashboardOrder[]>(PLACEHOLDER_ORDERS);

  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  const stats = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: "+12%",
    },
    {
      label: "Total Orders",
      value: orders.length.toString(),
      icon: Package,
      change: "+3",
    },
    {
      label: "Pending",
      value: pendingOrders.toString(),
      icon: Clock,
      change: "",
    },
    {
      label: "Page Views",
      value: "2,847",
      icon: Eye,
      change: "+24%",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-serif text-3xl font-bold text-soft-black">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gallery-gray">
            Overview of your gallery performance
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gallery-gray">
          <TrendingUp className="h-4 w-4 text-success" />
          Last 30 days
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-warm-white rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gallery-gray">{stat.label}</span>
              <stat.icon className="h-5 w-5 text-accent" />
            </div>
            <p className="text-2xl font-bold text-soft-black">{stat.value}</p>
            {stat.change && (
              <p className="text-xs text-success mt-1">{stat.change} from last month</p>
            )}
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-warm-white rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-cream">
          <h2 className="text-sm font-semibold text-soft-black uppercase tracking-wider">
            Recent Orders
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gallery-gray uppercase tracking-wider">
                <th className="px-6 py-3 font-medium">Order</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Artwork</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream">
              {orders.map((order) => {
                const statusInfo = STATUS_CONFIG[order.status];
                const StatusIcon = statusInfo.icon;
                return (
                  <tr key={order.id} className="text-sm">
                    <td className="px-6 py-4 font-medium text-soft-black">
                      {order.id}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-soft-black">{order.customer}</p>
                        <p className="text-xs text-gallery-gray">
                          {order.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gallery-gray">
                      {order.artwork}
                    </td>
                    <td className="px-6 py-4 font-medium text-soft-black">
                      ${order.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gallery-gray">
                      {new Date(order.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
