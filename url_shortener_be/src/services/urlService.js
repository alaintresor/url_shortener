import db from "../database/models/index.js";
import { cacheService } from "./cacheService.js";
import { redisClient } from "../config/redis.js";

const Url = db["Url"];

class UrlService {
  static async createShortUrl(user_id, long_url) {
    try {
      const short_code = Math.random().toString(36).substring(2, 8);
      const newUrl = await Url.create({
        user_id,
        short_code,
        long_url,
        clicks: 0,
      });

      // Cache the new URL
      await cacheService.set(`url:${short_code}`, newUrl);
      
      // Invalidate all user's URLs cache patterns
      const keys = await redisClient.keys(`user_urls:${user_id}:*`);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
      
      // Invalidate user stats cache
      await cacheService.delete(`user_stats:${user_id}`);

      return newUrl;
    } catch (error) {
      console.error("Error creating short URL:", error);
      throw error;
    }
  }

  static async getUrlByShortCode(short_code) {
    try {
      // Try to get from cache first
      const cachedUrl = await cacheService.get(`url:${short_code}`);
      if (cachedUrl) {
        return cachedUrl;
      }

      const url = await Url.findOne({
        where: { short_code },
      });

      if (!url) {
        throw new Error("URL not found");
      }

      // Cache the URL
      await cacheService.set(`url:${short_code}`, url);

      return url;
    } catch (error) {
      console.error("Error fetching URL by short code:", error);
      throw error;
    }
  }

  static async incrementClickCount(short_code) {
    try {
      const url = await Url.findOne({
        where: { short_code },
      });

      if (!url) {
        throw new Error("URL not found");
      }

      url.clicks += 1;
      await url.save();

      // Update cache
      await cacheService.set(`url:${short_code}`, url);
      
      // Invalidate all user's URLs cache patterns
      const keys = await redisClient.keys(`user_urls:${url.user_id}:*`);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
      
      // Invalidate user stats cache
      await cacheService.delete(`user_stats:${url.user_id}`);

      return url;
    } catch (error) {
      console.error("Error incrementing click count:", error);
      throw error;
    }
  }

  static async getUrlById(id) {
    try {
      // Try to get from cache first
      const cachedUrl = await cacheService.get(`url_id:${id}`);
      if (cachedUrl) {
        return cachedUrl;
      }

      const url = await Url.findByPk(id);

      if (!url) {
        throw new Error("URL not found");
      }

      // Cache the URL
      await cacheService.set(`url_id:${id}`, url);

      return url;
    } catch (error) {
      console.error("Error fetching URL by ID:", error);
      throw error;
    }
  }

  static async getUserUrls(user_id, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const cacheKey = `user_urls:${user_id}:${page}:${limit}`;
      
      console.log('Query params:', { user_id, page, limit, offset });
      
      // Try to get from cache first
      const cachedData = await cacheService.get(cacheKey);
      if (cachedData) {
        console.log('Returning cached data:', cachedData);
        return cachedData;
      }

      const { count, rows: urls } = await Url.findAndCountAll({
        where: { user_id },
        order: [["clicks", "DESC"]],
        limit,
        offset,
      });

      console.log('Database query results:', { count, urlsCount: urls.length, urls });

      // Don't throw an error if no URLs are found, just return empty array with pagination info
      const paginatedData = {
        urls: urls || [],
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        }
      };

      console.log('Final paginated data:', paginatedData);

      // Cache the paginated data
      await cacheService.set(cacheKey, paginatedData);

      return paginatedData;
    } catch (error) {
      console.error("Error fetching user URLs:", error);
      throw error;
    }
  }

  static async getUrlByLongUrl(long_url) {
    try {
      // Try to get from cache first
      const cachedUrl = await cacheService.get(`url_long:${long_url}`);
      if (cachedUrl) {
        return cachedUrl;
      }

      const url = await Url.findOne({
        where: { long_url },
      });

      if (url) {
        // Cache the URL
        await cacheService.set(`url_long:${long_url}`, url);
      }

      return url;
    } catch (error) {
      console.error("Error fetching URL by long URL:", error);
      throw error;
    }
  }

  static async getStatistics(user_id) {
    try {
      // Try to get from cache first
      const cachedStats = await cacheService.get(`user_stats:${user_id}`);
      if (cachedStats) {
        return cachedStats;
      }

      const urls = await Url.findAll({
        where: { user_id },
      });

      const totalClicks = urls.reduce((acc, url) => acc + url.clicks, 0);
      const activeUrls = urls.filter((url) => url.clicks > 0).length;

      const stats = {
        totalUrls: urls.length,
        totalClicks,
        activeUrls,
      };

      // Cache the statistics
      await cacheService.set(`user_stats:${user_id}`, stats);

      return stats;
    } catch (error) {
      console.error("Error fetching statistics:", error);
      throw error;
    }
  }

  static async updateUrl(id, long_url) {
    try {
      const urlToUpdate = await Url.findByPk(id);

      if (!urlToUpdate) {
        throw new Error("URL not found");
      }

      urlToUpdate.long_url = long_url;
      await urlToUpdate.save();

      // Update caches
      await cacheService.set(`url_id:${id}`, urlToUpdate);
      await cacheService.set(`url:${urlToUpdate.short_code}`, urlToUpdate);
      await cacheService.delete(`url_long:${long_url}`);
      
      // Invalidate user's URLs and stats cache
      await cacheService.delete(`user_urls:${urlToUpdate.user_id}`);
      await cacheService.delete(`user_stats:${urlToUpdate.user_id}`);

      return urlToUpdate;
    } catch (error) {
      console.error("Error updating URL:", error);
      throw error;
    }
  }

  static async deleteUrl(id) {
    try {
      const urlToDelete = await Url.findByPk(id);

      if (!urlToDelete) {
        throw new Error("URL not found");
      }

      await Url.destroy({ where: { id } });

      // Clear related caches
      await cacheService.delete(`url_id:${id}`);
      await cacheService.delete(`url:${urlToDelete.short_code}`);
      await cacheService.delete(`url_long:${urlToDelete.long_url}`);
      await cacheService.delete(`user_urls:${urlToDelete.user_id}`);
      await cacheService.delete(`user_stats:${urlToDelete.user_id}`);

      return urlToDelete;
    } catch (error) {
      console.error("Error deleting URL:", error);
      throw error;
    }
  }
}

export default UrlService;
