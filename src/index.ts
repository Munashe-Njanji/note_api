import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";

import { user } from "./user";
import { note } from "./note";
import { opentelemetry } from "@elysiajs/opentelemetry";

const app = new Elysia()
.use(opentelemetry())  
.use(
    swagger({
      documentation: {
        info: {
          title: "Note Taking API",
          description:
            "A modern API for note-taking with secure user authentication",
          version: "1.0.0",
        },
        tags: [
          {
            name: "User",
            description: "User authentication and profile management",
          },
          {
            name: "Note",
            description: "Note management operations",
          },
        ],
        components: {
          schemas: {
            SignInRequest: {
              type: "object",
              properties: {
                username: {
                  type: "string",
                  minLength: 1,
                },
                password: {
                  type: "string",
                  minLength: 8,
                },
              },
              required: ["username", "password"],
            },
            ApiResponse: {
              type: "object",
              properties: {
                success: {
                  type: "boolean",
                },
                message: {
                  type: "string",
                },
              },
              required: ["success"],
            },
            ProfileResponse: {
              type: "object",
              properties: {
                success: {
                  type: "boolean",
                },
                username: {
                  type: "string",
                },
              },
              required: ["success", "username"],
            },
            Memo: {
              type: "object",
              properties: {
                data: {
                  type: "string",
                },
                author: {
                  type: "string",
                },
              },
              required: ["data", "author"],
            },
          },
          securitySchemes: {
            cookieAuth: {
              type: "apiKey",
              in: "cookie",
              name: "token",
            },
          },
        },
        paths: {
          "/user/sign-up": {
            put: {
              tags: ["User"],
              summary: "Register a new user",
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/SignInRequest",
                    },
                  },
                },
              },
              responses: {
                "200": {
                  description: "User created successfully",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                    },
                  },
                },
                "400": {
                  description: "User already exists",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                    },
                  },
                },
              },
            },
          },
          "/user/sign-in": {
            post: {
              tags: ["User"],
              summary: "Authenticate user and create session",
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/SignInRequest",
                    },
                  },
                },
              },
              responses: {
                "200": {
                  description: "Authentication successful",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                    },
                  },
                },
                "400": {
                  description: "Invalid credentials",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                    },
                  },
                },
              },
            },
          },
          "/user/sign-out": {
            get: {
              tags: ["User"],
              summary: "End user session",
              security: [{ cookieAuth: [] }],
              responses: {
                "200": {
                  description: "Successfully signed out",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                    },
                  },
                },
              },
            },
          },
          "/user/profile": {
            get: {
              tags: ["User"],
              summary: "Get current user profile",
              security: [{ cookieAuth: [] }],
              responses: {
                "200": {
                  description: "Profile retrieved successfully",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/ProfileResponse",
                      },
                    },
                  },
                },
                "401": {
                  description: "Unauthorized",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                    },
                  },
                },
              },
            },
          },
          "/note/": {
            get: {
              tags: ["Note"],
              security: [{ cookieAuth: [] }],
              summary: "Get all memos",
              responses: {
                "200": {
                  description: "List of all memos",
                  content: {
                    "application/json": {
                      schema: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/Memo",
                        },
                      },
                    },
                  },
                },
                "401": {
                  description: "Unauthorized",
                },
              },
            },
            put: {
              tags: ["Note"],
              security: [{ cookieAuth: [] }],
              summary: "Create new memo",
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        data: {
                          type: "string",
                        },
                      },
                      required: ["data"],
                    },
                  },
                },
              },
              responses: {
                "200": {
                  description: "Memo created successfully",
                  content: {
                    "application/json": {
                      schema: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/Memo",
                        },
                      },
                    },
                  },
                },
                "401": {
                  description: "Unauthorized",
                },
              },
            },
          },
          "/note/{index}": {
            parameters: [
              {
                name: "index",
                in: "path",
                required: true,
                schema: {
                  type: "number",
                },
              },
            ],
            get: {
              tags: ["Note"],
              security: [{ cookieAuth: [] }],
              summary: "Get memo by index",
              responses: {
                "200": {
                  description: "Memo found",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/Memo",
                      },
                    },
                  },
                },
                "404": {
                  description: "Memo not found",
                },
                "401": {
                  description: "Unauthorized",
                },
              },
            },
            patch: {
              tags: ["Note"],
              security: [{ cookieAuth: [] }],
              summary: "Update memo by index",
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        data: {
                          type: "string",
                        },
                      },
                      required: ["data"],
                    },
                  },
                },
              },
              responses: {
                "200": {
                  description: "Memo updated successfully",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/Memo",
                      },
                    },
                  },
                },
                "422": {
                  description: "Invalid index",
                },
                "401": {
                  description: "Unauthorized",
                },
              },
            },
            delete: {
              tags: ["Note"],
              security: [{ cookieAuth: [] }],
              summary: "Delete memo by index",
              responses: {
                "200": {
                  description: "Memo deleted successfully",
                  content: {
                    "application/json": {
                      schema: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/Memo",
                        },
                      },
                    },
                  },
                },
                "422": {
                  description: "Invalid index",
                },
                "401": {
                  description: "Unauthorized",
                },
              },
            },
          },
        },
      },
    })
  )
  .use(user)
  .use(note)
  .listen(3000);

console.log("🦊 Server is running on http://localhost:3000");
console.log("📚 Swagger docs available at http://localhost:3000/swagger");
