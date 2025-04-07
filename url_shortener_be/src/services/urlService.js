import db from "../database/models/index.js";
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

      return newUrl;
    } catch (error) {
      console.error("Error creating short URL:", error);
      throw error;
    }
  }

  static async getUrlByShortCode(short_code) {
    try {
      const url = await Url.findOne({
        where: { short_code },
      });

      if (!url) {
        throw new Error("URL not found");
      }

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

      return url;
    } catch (error) {
      console.error("Error incrementing click count:", error);
      throw error;
    }
  }

  static async getUrlById(id) {
    try {
      const url = await Url.findByPk(id);

      if (!url) {
        throw new Error("URL not found");
      }

      return url;
    } catch (error) {
      console.error("Error fetching URL by ID:", error);
      throw error;
    }
  }

  static async getUserUrls(user_id) {
    try {
      const urls = await Url.findAll({
        where: { user_id },
        order: [["clicks", "DESC"]],
      });
      if (!urls || urls.length === 0) {
        throw new Error("No URLs found");
      }
      return urls;
    } catch (error) {
      console.error("Error fetching user URLs:", error);
      throw error;
    }
  }

  //getUrlByLongUrl
  static async getUrlByLongUrl(long_url) {
    try {
      const url = await Url.findOne({
        where: { long_url },
      });

      return url;
    } catch (error) {
      console.error("Error fetching URL by long URL:", error);
      throw error;
    }
  }

  static async getStatistics(user_id) {
    try {
      const urls = await Url.findAll({
        where: { user_id },
      });

      const totalClicks = urls.reduce((acc, url) => acc + url.clicks, 0);
      const activeUrls = urls.filter((url) => url.clicks > 0).length;

      return {
        totalUrls: urls.length,
        totalClicks,
        activeUrls,
      };
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
      return urlToDelete;
    } catch (error) {
      console.error("Error deleting URL:", error);
      throw error;
    }
  }
}

export default UrlService;
