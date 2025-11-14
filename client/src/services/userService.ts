import axios, { AxiosError } from "axios";
import type { UserAuth } from "./authService";

export interface User {
  id: number;
  username: string;
  password?: string | null | BigInteger;
  isAdmin?: number;
}

export interface UserResponse {
  success: boolean;
  message?: string;
  data?: User;
}

export interface FetchingUsersResponse {
  success: boolean;
  message?: string;
  data?: User[];
}

// Define the error response structure from your API
interface ApiErrorResponse {
  message?: string;
}
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function fetchUserData(token: string): Promise<UserResponse> {
  try {
    const response = await axios.post(
      `${API_URL}/auth/token-verification`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = response.data;
    // console.log("User data: ", data);
    return data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Unexpected error occured, try again later.",
    };
  }
}

export async function fetchUsers(): Promise<FetchingUsersResponse> {
  try {
    const response = await axios.get(`${API_URL}/users/fetchUsers`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = response.data;
    // console.log("Users Fetched: ", data);
    return data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong while fetching users.",
    };
  }
}

export async function createUser(formData: UserAuth): Promise<UserResponse> {
  try {
    const response = await axios.post(`${API_URL}/users/createUser`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log("creating user");
    if (response.status === 201) {
      return {
        success: true,
        message: "User created successfully",
        data: response.data.data, // Access the nested data from your API response
      };
    }

    return {
      success: false,
      message: "Unexpected response status",
    };
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
    console.error("Error creating user:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function editUser(
  id: number,
  formData: UserAuth
): Promise<UserResponse> {
  try {
    const response = await axios.put(
      `${API_URL}/users/updateUser/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // console.log("editing user details");
    if (response.status === 200) {
      return {
        success: true,
        message: "User updated successfully",
        data: response.data.data, // Access the nested data from your API response
      };
    }

    return {
      success: false,
      message: "Unexpected response status",
    };
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

export async function removeUser(id: number): Promise<UserResponse> {
  try {
    const response = await axios.delete(`${API_URL}/users/deleteUser/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("deleting user details");
    if (response.status === 200) {
      return {
        success: true,
        message: "User deleted successfully",
        data: response.data.data, // Access the nested data from your API response
      };
    }

    return {
      success: false,
      message: "Unexpected response status",
    };
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
