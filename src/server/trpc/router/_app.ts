import { isTokenValid } from "@samual/hackmud-chat/api"
import { getChannelData } from "@samual/hackmud-chat/getChannelData"
import { getMessages } from "@samual/hackmud-chat/getMessages"
import { z } from "zod"
import { procedure, router } from "../utils"

export const appRouter = router({
	getChannelData: procedure.input(z.string()).query(({ input: token }) => getChannelData(token)),

	isTokenValid: procedure.input(z.string()).query(({ input: token }) => isTokenValid(token)),

	getMessagesBefore: procedure
		.input(z.object({ token: z.string(), users: z.array(z.string()), date: z.date() }))
		.query(({ input: { token, users, date } }) => getMessages(token, users, date, `before`)),

	getMessagesAfter: procedure
		.input(z.object({ token: z.string(), users: z.array(z.string()), date: z.date() }))
		.query(({ input: { token, users, date } }) => getMessages(token, users, date, `after`))
})

export type IAppRouter = typeof appRouter
