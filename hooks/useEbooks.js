import useSWR from 'swr';

const fetcher = (url) =>
  fetch(url, { 
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  }).then(r => r.ok ? r.json() : null);

export function useEbooks() {
  const { data, error, isLoading } = useSWR('/api/ebooks/user', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000, // Cache 1 minute
  });

  return {
    ebooks: data?.ebooks || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
  };
}

export function useProfile() {
  const { data, error, isLoading } = useSWR('/api/profile/get', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 300000, // Cache 5 minutes
  });

  return {
    user: data?.user || null,
    isLoading,
    isError: error,
  };
}