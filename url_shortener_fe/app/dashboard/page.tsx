"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect, useState } from "react";
import { fetchUrls, fetchUrlStatistics } from "@/store/slices/urlSlice";
import { formatDate } from "@/utils/formatDate";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { urls, statistics, pagination, loading } = useAppSelector((state) => state.urls);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // fetch the recent links from the API or state
  useEffect(() => {
    dispatch(fetchUrlStatistics());
    dispatch(fetchUrls({ page: currentPage, limit: pageSize }));
  }, [dispatch, currentPage, pageSize]);

  const domain = process.env.NEXT_PUBLIC_DOMAIN;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  // Debug information
  console.log("URLs:", urls);
  console.log("Pagination:", pagination);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/dashboard/shorten">
          <Button>Shorten New URL</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Links</CardTitle>
            <CardDescription>All time shortened URLs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{statistics?.totalUrls}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
            <CardDescription>All time link clicks</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{statistics?.totalClicks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Links</CardTitle>
            <CardDescription>Links clicked this month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{statistics?.activeUrls}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Links</CardTitle>
          <CardDescription>Your recently shortened URLs</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Original URL</TableHead>
                <TableHead>Short URL</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : urls?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No URLs found
                  </TableCell>
                </TableRow>
              ) : (
                urls?.map((link) => (
                  <TableRow key={link.short_code}>
                    <TableCell className="max-w-xs truncate">
                      {link.long_url}
                    </TableCell>
                    <TableCell>{`${domain}/${link.short_code}`}</TableCell>
                    <TableCell>{link.clicks}</TableCell>
                    <TableCell>{formatDate(link.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(`${domain}/${link.short_code}`)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(`${domain}/${link.short_code}`, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Showing {urls?.length || 0} of {pagination.total} URLs
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm">
                  Page {currentPage} of {pagination.totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}