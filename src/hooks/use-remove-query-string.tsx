import { useCallback } from "react";

const useRemoveQueryString = (searchParams: URLSearchParams) => {
  const removeQueryString = useCallback(
    (name: string[]) => {
      const params = new URLSearchParams(searchParams.toString());

      name.map((key) => {
        params.delete(key);
      });

      return params.toString();
    },
    [searchParams],
  );

  return { removeQueryString };
};

export default useRemoveQueryString;
