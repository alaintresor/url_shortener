"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Link2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { createUrl, resetUrlState } from "@/store/slices/urlSlice";
import { CreateUrlPayload } from "@/types/urlTypes";

export default function ShortenURL() {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const dispatch = useAppDispatch();
  const { recentUrl, loading, error, success } = useAppSelector((state) => state.urls);

  const domain = process.env.NEXT_PUBLIC_DOMAIN;

  const [errors, setErrors] = useState({
    url: "",
    form: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingUrl, setExistingUrl] = useState<string | null>(null);

  const isValidUrl = (url: string): boolean => {
    try {
      // More robust URL validation
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    if (error) {
      // Check if the error is about an existing URL
      if (error === "URL already exists") {
        setExistingUrl(recentUrl?.short_code || "");
        setErrors(prev => ({
          ...prev,
          form: "This URL has already been shortened. You can use the existing short URL below."
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          form: error
        }));
      }
      setIsSubmitting(false);
    }
  }, [error, recentUrl]);

  // Validate form fields
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      url: "",
      form: ""
    };

    // URL validation
    if (!url.trim()) {
      newErrors.url = "URL is required";
      isValid = false;
    } else if (!isValidUrl(url)) {
      newErrors.url = "Please enter a valid URL";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setExistingUrl(null);
    setErrors(prev => ({
      ...prev,
      form: ""
    }));
    
    try {
      const newUrl: CreateUrlPayload = {
        long_url: url,
      };
      await dispatch(createUrl(newUrl)).unwrap();
    } catch (err) {
      // Error is already handled in the useEffect
      console.error("Error creating URL:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    const urlToCopy = existingUrl 
      ? `${domain}/${existingUrl}` 
      : `${domain}/${shortenedUrl}`;
    
    navigator.clipboard.writeText(urlToCopy);
    // You could add a toast notification here
  };

  useEffect(() => {
    if (success) {
      setShortenedUrl(recentUrl?.short_code || "");
      setUrl("");
      setErrors({
        url: "",
        form: ""
      });
      setExistingUrl(null);
      dispatch(resetUrlState());
    }
  }, [success, dispatch, recentUrl]);

  const handleBlur = (field: string) => {
    validateField(field);
  };

  const validateField = (field: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'url':
        if (!url.trim()) {
          newErrors.url = "URL is required";
        } else if (!isValidUrl(url)) {
          newErrors.url = "Please enter a valid URL";
        } else {
          newErrors.url = "";
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Shorten URL</h1>
        <p className="text-gray-600 mt-2">
          Create a shortened URL that's easy to remember and share
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Short URL</CardTitle>
          <CardDescription>
            Enter a long URL to create a shortened version
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errors.form && (
            <div className={`mb-4 p-3 rounded-md ${errors.form.includes("already been shortened") ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
              {errors.form}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url">Destination URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/your/long/url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={() => handleBlur('url')}
                className={`mt-1 ${errors.url ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.url && <span className="text-sm text-red-500">{errors.url}</span>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
              {(isSubmitting || loading) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Shortening...</span>
                </>
              ) : (
                <>
                  <Link2 className="mr-2 h-5 w-5" />
                  Shorten URL
                </>
              )}
            </Button>
          </form>

          {shortenedUrl && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <Label>Your shortened URL</Label>
              <div className="flex mt-2">
                <Input value={`${domain}/${shortenedUrl}`} readOnly />
                <Button
                  variant="outline"
                  className="ml-2"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {existingUrl && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <Label>Existing shortened URL</Label>
              <div className="flex mt-2">
                <Input value={`${domain}/${existingUrl}`} readOnly />
                <Button
                  variant="outline"
                  className="ml-2"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}