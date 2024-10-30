import ApiClient from "./apiClient";

export type RemoveParams= {
  id: string, 
  filename: string,
  removeKey: 'cvUrl' | 'profileImage'
}

interface IHttpUploadsClient {
  update: (id: string, file: FormData) => Promise<object>;
  remove: (params: RemoveParams) => Promise<object>;
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

  const remove = async (params:RemoveParams) => {
    return await ApiClient<object>(
      `${API_URL}rpc/uploads/${params.id}/remove-cv`,
      {
        headers: { 
            Accept: "application/json",
            "Content-Type": "application/json"},
        method: "POST",
        body: JSON.stringify({
            filename: params.filename,
            removeKey: params.removeKey
        }),
      },
      false
    );
  };


  return { update, remove };
};

export default httpUploadsClient;
