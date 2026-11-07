import { useEffect, useState } from "react";

export function useFetch(fetcher, dependencies = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  useEffect(() => {
    let active = true;
    setState((current) => ({ ...current, loading: true, error: null }));
    fetcher()
      .then((data) => { if (active) setState({ data, loading: false, error: null }); })
      .catch((error) => { if (active) setState({ data: null, loading: false, error }); });
    return () => { active = false; };
  }, dependencies);
  return state;
}
