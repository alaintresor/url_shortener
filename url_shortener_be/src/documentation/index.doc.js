import { Router } from "express";
import { serve, setup } from "swagger-ui-express";

const docrouter = Router();

const options = {
  openapi: "3.0.1",
  info: {
    title: "URL Shortener",
    version: "1.0.0",
    description: "URL Shortener APIs Documentation",
  },
  basePath: "/api",
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    { name: "Auth", description: "Auth" },
    { name: "URLs", description: "URLs" },
  ],
  paths: {
    "/api/v1/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "create a user",
        description: "create a user",
        operationId: "createUser",
        security: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
              example: {
                username: "john doe",
                email: "root@example.com",
                password: "root123",
              },
            },
          },
        },
        responses: {
          201: {
            description: "User created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "success"
                    },
                    user: {
                      type: "object",
                      properties: {
                        id: {
                          type: "integer",
                          example: 1
                        },
                        username: {
                          type: "string",
                          example: "john doe"
                        },
                        email: {
                          type: "string",
                          example: "root@example.com"
                        }
                      }
                    },
                    accessToken: {
                      type: "string",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    }
                  }
                }
              }
            }
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login a user",
        description: "Login a user",
        operationId: "loginUser",
        security: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
              example: {
                email: "root@example.com",
                password: "root123",
              },
            },
          },
        },
        responses: {
          200: {
            description: "User logged in successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "success"
                    },
                    message: {
                      type: "string",
                      example: "Login successful"
                    },
                    accessToken: {
                      type: "string",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    },
                    user: {
                      type: "object",
                      properties: {
                        id: {
                          type: "integer",
                          example: 1
                        },
                        username: {
                          type: "string",
                          example: "john doe"
                        },
                        email: {
                          type: "string",
                          example: "root@example.com"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/auth/refresh-token": {
      post: {
        tags: ["Auth"],
        summary: "Refresh access token",
        description: "Get a new access token using the refresh token stored in cookies",
        operationId: "refreshToken",
        security: [],
        responses: {
          200: {
            description: "New access token generated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "success"
                    },
                    accessToken: {
                      type: "string",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    }
                  }
                }
              }
            }
          },
          401: {
            description: "Refresh token required",
          },
          403: {
            description: "Invalid refresh token",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout user",
        description: "Invalidate the refresh token and clear cookies",
        operationId: "logoutUser",
        security: [],
        responses: {
          200: {
            description: "User logged out successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "success"
                    },
                    message: {
                      type: "string",
                      example: "Logged out successfully"
                    }
                  }
                }
              }
            }
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/urls": {
      post: {
        tags: ["URLs"],
        summary: "Create a short URL",
        description: "Create a short URL",
        operationId: "createShortUrl",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  longUrl: {
                    type: "string",
                    description: "The original long URL",
                  },
                },
                required: ["longUrl"],
              },
              example: {
                longUrl: "https://example.com",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Short URL created successfully",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
      get: {
        tags: ["URLs"],
        summary: "Get all URLs for a user",
        description: "Retrieve all URLs created by the user",
        operationId: "getUserUrls",
        responses: {
          200: {
            description: "List of URLs retrieved successfully",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/urls/{short_code}": {
      get: {
        tags: ["URLs"],
        summary: "Get URL by short code",
        description: "Retrieve the original URL using the short code",
        operationId: "getUrlByShortCode",
        parameters: [
          {
            name: "short_code",
            in: "path",
            required: true,
            description: "The short code of the URL",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Original URL retrieved successfully",
          },
          404: {
            description: "Short code not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
      post: {
        tags: ["URLs"],
        summary: "Increment click count for a short URL",
        description: "Increment the click count for a specific short URL",
        operationId: "incrementClickCount",
        parameters: [
          {
            name: "short_code",
            in: "path",
            required: true,
            description: "The short code of the URL",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Click count incremented successfully",
          },
          404: {
            description: "Short code not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/urls/{id}": {
      put: {
        tags: ["URLs"],
        summary: "Update a URL",
        description: "Update the details of an existing URL",
        operationId: "updateUrl",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "The ID of the URL to update",
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  longUrl: {
                    type: "string",
                    description: "The updated long URL",
                  },
                },
              },
              example: {
                longUrl: "https://updated-example.com",
              },
            },
          },
        },
        responses: {
          200: {
            description: "URL updated successfully",
          },
          400: {
            description: "Bad request",
          },
          404: {
            description: "URL not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
      delete: {
        tags: ["URLs"],
        summary: "Delete a URL",
        description: "Delete an existing URL by its ID",
        operationId: "deleteUrl",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "The ID of the URL to delete",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "URL deleted successfully",
          },
          404: {
            description: "URL not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          username: {
            type: "string",
            description: "username",
          },
          email: {
            type: "string",
            description: "User's email address",
          },
          password: {
            type: "string",
            description: "User's password",
          },
          refreshToken: {
            type: "string",
            description: "JWT refresh token",
            readOnly: true
          },
        },
      },
      Url: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            description: "URL ID",
          },
          user_id: {
            type: "integer",
            description: "User's ID who created the URL",
          },
          long_url: {
            type: "string",
            description: "Original long URL",
          },
          short_code: {
            type: "string",
            description: "Generated short code",
          },
          clicks: {
            type: "integer",
            description: "Number of times the URL was clicked",
          },
          created_at: {
            type: "string",
            format: "date-time",
            description: "URL creation timestamp",
          },
          updated_at: {
            type: "string",
            format: "date-time",
            description: "URL last update timestamp",
          },
        },
      },
      PaginationInfo: {
        type: "object",
        properties: {
          currentPage: {
            type: "integer",
            description: "Current page number",
          },
          totalPages: {
            type: "integer",
            description: "Total number of pages",
          },
          totalItems: {
            type: "integer",
            description: "Total number of items",
          },
          itemsPerPage: {
            type: "integer",
            description: "Number of items per page",
          },
        },
      },
      Statistics: {
        type: "object",
        properties: {
          totalUrls: {
            type: "integer",
            description: "Total number of URLs created",
          },
          totalClicks: {
            type: "integer",
            description: "Total number of clicks across all URLs",
          },
          averageClicksPerUrl: {
            type: "number",
            description: "Average number of clicks per URL",
          },
          mostClickedUrl: {
            type: "object",
            properties: {
              short_code: {
                type: "string",
                description: "Short code of the most clicked URL",
              },
              clicks: {
                type: "integer",
                description: "Number of clicks for the most clicked URL",
              },
            },
          },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

docrouter.use("/", serve, setup(options));

export default docrouter;
