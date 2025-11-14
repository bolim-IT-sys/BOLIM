import axios, { AxiosError } from "axios";
import type { StockItem } from "./stockItemService";

export interface Stock {
  id?: number;
  name: string;
  specs: string;
  availableItems?: StockItem[];
  deployedItems?: StockItem[];
}

export interface AddingStock {
  name: string;
}

export interface StockResponse {
  success: boolean;
  message?: string;
  data?: Stock;
}

export interface FetchingStocksResponse {
  success: boolean;
  message?: string;
  data?: Stock[];
}

// Define the error response structure from your API
interface ApiErrorResponse {
  message?: string;
}
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function fetchStockData(token: string): Promise<StockResponse> {
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
    // console.log("Stock data: ", data);
    return data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Unexpected error occured, try again later.",
    };
  }
}

export async function fetchStocks(): Promise<FetchingStocksResponse> {
  try {
    const response = await axios.get(`${API_URL}/stocks/fetchStocks`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = response.data;
    // console.log("Stocks Fetched: ", data);
    return data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong while fetching stocks.",
    };
  }
}

export async function createStock(formData: Stock): Promise<StockResponse> {
  try {
    const response = await axios.post(
      `${API_URL}/stocks/createStock`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // console.log("creating user");
    if (response.status === 201) {
      return response.data;
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

export async function editStock(
  id: number,
  formData: Stock
): Promise<StockResponse> {
  try {
    const response = await axios.put(
      `${API_URL}/stocks/updateStock/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // console.log("editing user details");
    if (response.status === 200) {
      return response.data;
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

export async function removeStock(id: number): Promise<StockResponse> {
  try {
    const response = await axios.delete(`${API_URL}/stocks/deleteStock/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("deleting user details");
    if (response.status === 200) {
      return response.data;
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

export async function createStockItem(
  stockId: number,
  formData: Stock
): Promise<StockResponse> {
  try {
    const response = await axios.post(
      `${API_URL}/stocks/addStockItem/${stockId}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // console.log("creating user");
    if (response.status === 201) {
      return response.data;
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
