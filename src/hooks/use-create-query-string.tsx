import { useCallback } from "react";

const useCreateQueryString = (searchParams: URLSearchParams) => {
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  return { createQueryString };
};

export default useCreateQueryString;
