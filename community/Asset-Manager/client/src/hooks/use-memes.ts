import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertMeme } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

// GET /api/memes
export function useMemes() {
  return useQuery({
    queryKey: [api.memes.list.path],
    queryFn: async () => {
      const res = await fetch(api.memes.list.path);
      if (!res.ok) throw new Error("Failed to fetch memes");
      return api.memes.list.responses[200].parse(await res.json());
    },
  });
}

// POST /api/memes
export function useCreateMeme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertMeme) => {
      const res = await apiRequest("POST", api.memes.create.path, data);
      return api.memes.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.memes.list.path] });
    },
  });
}
