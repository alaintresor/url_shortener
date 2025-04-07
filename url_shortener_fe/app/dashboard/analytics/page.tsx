"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Analytics() {
  const clickData = [
    { date: "2024-03-14", clicks: 65 },
    { date: "2024-03-15", clicks: 82 },
    { date: "2024-03-16", clicks: 73 },
    { date: "2024-03-17", clicks: 92 },
    { date: "2024-03-18", clicks: 105 },
    { date: "2024-03-19", clicks: 88 },
    { date: "2024-03-20", clicks: 96 },
  ];

  const referrers = [
    { source: "Facebook", clicks: 456, percentage: "34%" },
    { source: "Twitter", clicks: 312, percentage: "23%" },
    { source: "Instagram", clicks: 289, percentage: "21%" },
    { source: "LinkedIn", clicks: 167, percentage: "12%" },
    { source: "Direct", clicks: 134, percentage: "10%" },
  ];

  const locations = [
    { country: "United States", clicks: 678, percentage: "45%" },
    { country: "United Kingdom", clicks: 234, percentage: "16%" },
    { country: "Germany", clicks: 189, percentage: "13%" },
    { country: "France", clicks: 156, percentage: "10%" },
    { country: "Canada", clicks: 123, percentage: "8%" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <Select defaultValue="7days">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="custom">Custom range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Click Performance</CardTitle>
          <CardDescription>Total clicks over time</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={clickData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
            <CardDescription>Where your clicks are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrers.map((referrer) => (
                  <TableRow key={referrer.source}>
                    <TableCell>{referrer.source}</TableCell>
                    <TableCell>{referrer.clicks}</TableCell>
                    <TableCell>{referrer.percentage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Locations</CardTitle>
            <CardDescription>Geographic distribution of clicks</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Country</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((location) => (
                  <TableRow key={location.country}>
                    <TableCell>{location.country}</TableCell>
                    <TableCell>{location.clicks}</TableCell>
                    <TableCell>{location.percentage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}