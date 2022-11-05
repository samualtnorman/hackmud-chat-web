import { isTokenValid } from "@samual/hackmud-chat/api"
import { getChannelData } from "@samual/hackmud-chat/getChannelData"
import { getMessages } from "@samual/hackmud-chat/getMessages"
import { z } from "zod"
import { procedure, router } from "../utils"

export const appRouter = router({
	getChannelData: procedure.input(z.string()).query(async ({ input: token }) => {
		const { channels, users } = await getChannelData(token)
		return { channels: Object.fromEntries(channels.entries()), users: Object.fromEntries(users.entries()) }
	}),

	isTokenValid: procedure.input(z.string()).query(({ input: token }) => isTokenValid(token)),

	getMessagesBefore: procedure
		.input(z.object({ token: z.string(), users: z.array(z.string()), date: z.number() }))
		.query(async ({ input: { token, users, date } }) =>
			(await getMessages(token, users, new Date(date), `before`)).map((message) => ({
				...message,
				date: Number(message.date)
			}))
		),

	getMessagesAfter: procedure
		.input(z.object({ token: z.string(), users: z.array(z.string()), date: z.number() }))
		.query(async ({ input: { token, users, date } }) =>
			(await getMessages(token, users, new Date(date), `after`)).map(({ content, date, id, kind, sender }) => ({
				content,
				date: Number(date),
				id,
				kind,
				sender
			}))
		)
})

export type IAppRouter = typeof appRouter
