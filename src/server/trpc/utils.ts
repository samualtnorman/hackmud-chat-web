import { initTRPC } from "@trpc/server"
import SuperJSON from "superjson"
import { IContext } from "./context"

export const t = initTRPC.context<IContext>().create({ transformer: SuperJSON })

export const router = t.router
export const procedure = t.procedure
