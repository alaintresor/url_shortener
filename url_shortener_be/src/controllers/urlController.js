import UrlService from "../services/urlService";

class UrlController {
  static async createShortUrl(req, res) {
    try {
      const { user } = req;
      const { long_url } = req.body;

      if (!long_url) {
        return res.status(400).json({ error: "url is required" });
      }

      const existingUrl = await UrlService.getUrlByLongUrl(long_url);
      if (existingUrl) {
        return res.status(409).json({
          error: "URL already exists",
          url: existingUrl,
        });
      }

      const newUrl = await UrlService.createShortUrl(user.id, long_url);
      return res.status(201).json({
        status: "success",
        message: "URL created successfully",
        url: newUrl,
      });
    } catch (error) {
      console.error("Error creating short URL:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while creating the short URL" });
    }
  }

  static async getUrlByShortCode(req, res) {
    try {
      const { short_code } = req.params;
      const url = await UrlService.getUrlByShortCode(short_code);
      if (!url) {
        return res.status(404).json({ error: "URL not found" });
      }
      // Increment the click count
      await UrlService.incrementClickCount(short_code);
      // Redirect to the long URL
      const isValidUrl = (str) => {
        try {
          new URL(str);
          return true;
        } catch (_) {
          return false;
        }
      };

      let longUrl = url.long_url;
      if (!isValidUrl(longUrl)) {
        longUrl = `http://${longUrl}`;
      }

      return res.redirect(longUrl);
    } catch (error) {
      console.error("Error fetching URL by short code:", error);
      return res.status(404).json({ error: "URL not found" });
    }
  }

  static async getUrlById(req, res) {
    try {
      const { id } = req.params;
      const url = await UrlService.getUrlById(id);
      return res.status(200).json(url);
    } catch (error) {
      console.error("Error fetching URL by ID:", error);
      return res.status(404).json({ error: "URL not found" });
    }
  }

  static async getUserUrls(req, res) {
    try {
      const { user } = req;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      // Validate pagination parameters
      if (page < 1) {
        return res.status(400).json({ error: "Page number must be greater than 0" });
      }
      if (limit < 1 || limit > 100) {
        return res.status(400).json({ error: "Limit must be between 1 and 100" });
      }

      const result = await UrlService.getUserUrls(user.id, page, limit);
      
      // Return the URLs and pagination info
      return res.status(200).json({
        status: "success",
        message: result.urls.length > 0 ? "URLs retrieved successfully" : "No URLs found",
        urls: result.urls,
        pagination: result.pagination
      });
    } catch (error) {
      console.error("Error fetching user URLs:", error);
      return res.status(404).json({ error: "URLs not found" });
    }
  }

  static async getStatistics(req, res) {
    try {
      const { user } = req;

      const statistics = await UrlService.getStatistics(user.id);

      return res.status(200).json({
        status: "success",
        message: "Statistics retrieved successfully",
        statistics,
      });
    } catch (error) {
      console.error("Error fetching URL statistics:", error);
      return res.status(404).json({ error: "URL not found" });
    }
  }

  static async updateUrl(req, res) {
    try {
      const { id } = req.params;
      const { long_url } = req.body;

      if (!long_url) {
        return res.status(400).json({ error: "Missing long_url" });
      }

      const updatedUrl = await UrlService.updateUrl(id, long_url);
      return res.status(200).json({
        id: updatedUrl.id,
        short_code: updatedUrl.short_code,
        long_url: updatedUrl.long_url,
      });
    } catch (error) {
      console.error("Error updating URL:", error);
      return res.status(404).json({ error: "URL not found" });
    }
  }

  static async deleteUrl(req, res) {
    try {
      const { id } = req.params;
      const deletedUrl = await UrlService.deleteUrl(id);
      return res
        .status(200)
        .json({ message: "URL deleted successfully", url: deletedUrl });
    } catch (error) {
      console.error("Error deleting URL:", error);
      return res.status(404).json({ error: "URL not found" });
    }
  }
}

export default UrlController;
