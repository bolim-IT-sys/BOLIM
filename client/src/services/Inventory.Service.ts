import axios, { AxiosError } from "axios";
import { type Dispatch, type SetStateAction } from "react";

export interface Inventory {
  id: number;
  inventory_name: string;
  item_name: string;
  unique_item: number;
}

export interface CreateInventory {
  inventory_name: string;
  item_name: string;
  unique_item: number;
}

export interface InventoryResponse {
  success: boolean;
  message?: string;
  data?: Inventory;
}

export interface FetchingInventorysResponse {
  success: boolean;
  message?: string;
  // data?: Inventory[];
}

// Define the error response structure from your API
interface ApiErrorResponse {
  message?: string;
}
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function fetchInventoryData(
  token: string
): Promise<InventoryResponse> {
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
    // console.log("Inventory data: ", data);
    return data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Unexpected error occured, try again later.",
    };
  }
}

export async function fetchInventories(
  setInventories: Dispatch<SetStateAction<Inventory[]>>
) {
  try {
    const response = await axios.get(`${API_URL}/inventory/fetch-inventories`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log("Inventorys Fetched: ", response.data);

    if (response.status === 200) {
      setInventories(response.data.data);
    } else {
      setInventories(response.data.data);
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong while fetching inventories.",
    };
  }
}

export async function createInventory(
  formData: CreateInventory
): Promise<InventoryResponse> {
  try {
    const response = await axios.post(
      `${API_URL}/inventory/create-inventory`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // console.log("creating inventory: ", formData);
    if (response.status === 201) {
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    // Type guard for Axios errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error(
        "Error creating inventory:",
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
    console.error("Error creating inventory:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function editInventory(
  id: number,
  formData: CreateInventory,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  load_inventories: () => void,
  setModalShow: Dispatch<SetStateAction<boolean>>,
  setFormData: Dispatch<SetStateAction<CreateInventory>>
) {
  try {
    setIsLoading(true);
    const response = await axios.put(
      `${API_URL}/inventory/update-inventory/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // console.log("editing inventory details");
    if (response.status === 200) {
      setTimeout(
        () => {
          alert(response.data.message);
          load_inventories();
          setModalShow(false);
          setFormData({
            inventory_name: formData.inventory_name,
            item_name: formData.item_name,
            unique_item: formData.unique_item,
          });
        },
        import.meta.env.VITE_TIME_OUT
      );
    } else {
      setTimeout(
        () => {
          alert(response.data.message);
        },
        import.meta.env.VITE_TIME_OUT
      );
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Unexpected error occured, try again later.",
    };
  } finally {
    setTimeout(
      () => {
        setIsLoading(false);
      },
      import.meta.env.VITE_TIME_OUT
    );
  }
}

export async function removeInventory(
  id: number,
  load_inventories: () => void,
  setIsDeleting: Dispatch<SetStateAction<number>>
) {
  try {
    setIsDeleting(id);
    const response = await axios.delete(
      `${API_URL}/inventory/delete-inventory/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // console.log("deleting inventory details");
    if (response.status === 200) {
      setTimeout(
        () => {
          alert(response.data.message);
          load_inventories();
        },
        import.meta.env.VITE_TIME_OUT
      );
    } else {
      setTimeout(
        () => {
          alert(response.data.message);
        },
        import.meta.env.VITE_TIME_OUT
      );
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Unexpected error occured, try again later.",
    };
  } finally {
    setTimeout(
      () => {
        setIsDeleting(0);
      },
      import.meta.env.VITE_TIME_OUT
    );
  }
}
