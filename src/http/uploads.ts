import ApiClient from "./apiClient";

interface IHttpUploadsClient {
  update: (id: string, file: FormData) => Promise<object>;
  remove: (id: string, filename: string) => Promise<object>;
}

const API_URL = import.meta.env.VITE_API_URL

const httpUploadsClient = (): IHttpUploadsClient => {

  const update = async (id: string, file: FormData) => {
    return await ApiClient<object>(
      `${API_URL}rpc/uploads/${id}/upload-cv`,
      {
        headers: {},
        method: "POST",
        body: file,
      },
      false
    );
  };

  const remove = async (id: string, filename: string) => {
    return await ApiClient<object>(
      `${API_URL}rpc/uploads/${id}/remove-cv`,
      {
        headers: { 
            Accept: "application/json",
            "Content-Type": "application/json"},
        method: "POST",
        body: JSON.stringify({
            filename
        }),
      },
      false
    );
  };


  return { update, remove };
};

export default httpUploadsClient;
