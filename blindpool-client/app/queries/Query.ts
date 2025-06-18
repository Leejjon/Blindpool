export const query = () => (
    {
        queryKey: ["fetch"],
        queryFn: async () => {
            const response = await fetch("https://anapioficeandfire.com/api/books/1");
            return response.status;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        cacheTime: 5000,
        staleTime: 60000,
        retry: false,
    }
)
