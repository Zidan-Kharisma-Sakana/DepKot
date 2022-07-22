import axios from "axios";
import { useState } from "react";

interface UseRequestProps {
  url: string;
  method: "post" | "get";
  body: any;
  onSuccess: (arg: any) => void;
}

const useRequest = ({ url, method, body, onSuccess }: UseRequestProps) => {
  const [errors, setErrors] = useState<any>(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      const error = err  as any
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {error?.response.data.errors.map((err: any) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;
