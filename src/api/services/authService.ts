import api from "@/api/axios";
import type { User } from "@/types/user";
import type { AxiosResponse } from "axios";

const authService = {
  login: async (username: string, password: string): Promise<AxiosResponse<User>> => {
    const base64Credentials = btoa(`${username}:${password}`);
    return await api.post<User>(
      "/login",
      {},
      {
        headers: {
          Authorization: `Basic ${base64Credentials}`,
        },
      }
    );
  },

  logout: async (): Promise<AxiosResponse<void>> => {
    return await api.post<void>("/logout");
  },

  getLoggedInUser: async (): Promise<AxiosResponse<User>> => {
    return await api.get<User>("/client/me");
  },
};

export default authService;
