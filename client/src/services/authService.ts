import axios, { AxiosError } from "axios";

export interface UserAuth {
  username: string;
  password: string;
}

export interface UserResponse {
  success: boolean;
  message?: string;
  data?: UserAuth;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}

// Define the error response structure from your API
interface ApiErrorResponse {
  message?: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export async function login(formData: UserAuth): Promise<LoginResponse> {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = response.data;

    if (data.success && data.token) {
      // console.log("Login success! Token: ", data.token);
      sessionStorage.setItem("token", data.token);
      // sessionStorage.setItem("user", JSON.stringify(data.user));
    }
    return data;
  } catch (error) {
    // Type guard for Axios errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error(
        "Error creating user:",
        axiosError.response?.data || axiosError.message
      );

      // Check if it's a connection error
      if (
        axiosError.code === "ERR_NETWORK" ||
        axiosError.message.includes("ERR_CONNECTION_REFUSED")
      ) {
        return {
          success: false,
          message:
            "Cannot connect to server. Please check if the server is running.",
        };
      }

      return {
        success: false,
        message: axiosError.response?.data?.message || axiosError.message,
      };
    }

    // Handle non-Axios errors
    console.error("Error updating user:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export function logout(): void {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
}
