import axios, { AxiosError } from "axios";

export interface StockItem {
  id: number;
  name: string;
  serialNumber: string;
  specs?: string;
  PRDate: string;
  receivedDate: Date;
  deployedDate: Date;
  station: string;
  department: string;
  remarks: string;
}

export interface AddingItem {
  stockId: number;
  serialNumber: string;
  specs?: string;
  PRDate: string;
  receivedDate: string;
  remarks: string;
}

export interface DeployingItem {
  serialNumber: string;
  deployedDate: string;
  station: string;
  department: string;
  remarks: string;
}

export interface StockItemResponse {
  success: boolean;
  message?: string;
  data?: StockItem;
}

export interface FetchingStockItemsResponse {
  success: boolean;
  message?: string;
  data?: StockItem[];
}

// Define the error response structure from your API
interface ApiErrorResponse {
  message?: string;
}
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function fetchStockItemData(
  token: string
): Promise<StockItemResponse> {
  try {
    const response = await axios.post(
      `${API_URL}/stockItem/auth/token-verification`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = response.data;
    // console.log("StockItem data: ", data);
    return data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Unexpected error occured, try again later.",
    };
  }
}

export async function fetchStockItems(
  stockId: number
): Promise<FetchingStockItemsResponse> {
  try {
    const response = await axios.get(
      `${API_URL}/stockItem/fetchStockItems/${stockId}`
    );

    const data = response.data;
    // console.log(`StockItems Fetched for ID ${stockId}: `, data);
    return data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong while fetching stocks.",
    };
  }
}

export async function createStockItem(
  formData: AddingItem
): Promise<StockItemResponse> {
  try {
    const response = await axios.post(
      `${API_URL}/stockItem/createStockItem`,
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

export async function deployStockItem(
  formData: DeployingItem
): Promise<StockItemResponse> {
  try {
    const response = await axios.put(
      `${API_URL}/stockItem/deployStockItem`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
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
        "Error deploying:",
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
    console.error("Error deploying item:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function editStockItem(
  id: number,
  formData: StockItem
): Promise<StockItemResponse> {
  try {
    const response = await axios.put(
      `${API_URL}/stockItem/updateStockItem/${id}`,
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

export async function removeStockItem(id: number): Promise<StockItemResponse> {
  try {
    const response = await axios.delete(
      `${API_URL}/stockItem/deleteStockItem/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
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

export async function createStockItemItem(
  stockId: number,
  formData: StockItem
): Promise<StockItemResponse> {
  try {
    const response = await axios.post(
      `${API_URL}/stockItem/addStockItemItem/${stockId}`,
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
