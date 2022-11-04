import { QueryClient } from "@tanstack/solid-query"
import { IAppRouter } from "~/server/trpc/router/_app"
import { createTRPCSolid } from "solid-trpc"
import { httpBatchLink } from "@trpc/client"
import SuperJSON from "superjson"

const getBaseUrl = () => {
	if (typeof window !== "undefined") return ""
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
	return `http://localhost:${process.env.PORT ?? 3000}`
}

export const trpc = createTRPCSolid<IAppRouter>()

export const client = trpc.createClient({
	links: [
		httpBatchLink({
			url: `${getBaseUrl()}/api/trpc`
		})
	],
	transformer: SuperJSON
})

export const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } })
