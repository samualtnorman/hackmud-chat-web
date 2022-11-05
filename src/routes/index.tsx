import { MessageKind } from "@samual/hackmud-chat"
import { createEffect, createSignal, For, Match, onMount, Show, Switch } from "solid-js"
import { trpc } from "~/utils/trpc"

export default () => {
	const [getToken, setToken] = createSignal(localStorage.getItem(`token`) || ``)

	createEffect(() => {
		console.log(`getToken():`, getToken())
		localStorage.setItem(`token`, getToken())
	})

	const tokenIsValid = trpc.isTokenValid.useQuery(() => getToken(), {
		get enabled() {
			return !!getToken()
		}
	})

	createEffect(() => console.log(`tokenIsValid.data:`, tokenIsValid.data))

	const localStorageChannelData = localStorage.getItem(`channelData`)

	const channelData = trpc.getChannelData.useQuery(() => getToken(), {
		get enabled() {
			return !!tokenIsValid.data
		},

		initialData: localStorageChannelData && JSON.parse(localStorageChannelData)
	})

	createEffect(() => {
		console.log(`channelData.data:`, channelData.data)
		localStorage.setItem(`channelData`, JSON.stringify(channelData.data))
	})

	const localStorageMessages = localStorage.getItem(`messages`)

	const messages = trpc.getMessagesBefore.useQuery(
		() =>
			(channelData.isFetched
				? { token: getToken(), users: Object.keys(channelData.data!.users), date: Date.now() }
				: undefined)!,
		{
			get enabled() {
				return channelData.isFetched
			},

			initialData: localStorageMessages ? JSON.parse(localStorageMessages) : undefined,
			refetchInterval: 1000
		}
	)

	onMount(() => (document.scrollingElement || document.body).scrollIntoView({ behavior: `smooth`, block: `end` }))

	console.log(messages)

	createEffect(() => {
		console.log(`messages.data:`, messages.data)
		localStorage.setItem(`messages`, JSON.stringify(messages.data));

		const scrollingElement = document.scrollingElement || document.body

		if (scrollingElement.scrollHeight - scrollingElement.scrollTop === scrollingElement.clientHeight )
			scrollingElement.scrollIntoView({ behavior: `smooth`, block: `end` })
	})

	return (
		<Switch fallback={<p>Loading</p>}>
			<Match when={!getToken()}>
				<p>Enter your token</p>
				<GetToken />
			</Match>

			<Match when={tokenIsValid.isFetched && tokenIsValid.data == false}>
				<p>Expired or invalid token</p>
				<GetToken />
			</Match>

			<Match when={messages.data}>
				<pre>
					<For each={messages.data}>
						{message => {
							const date = String(new Date(message.date).getHours()).padStart(2, `0`) + String(new Date(message.date).getMinutes()).padStart(2, `0`)

							const channel = message.kind == MessageKind.Tell
								? `from`
								: message.channel

							return `${date} ${channel} ${message.sender} :::${message.content}:::\n`
						}}
					</For>
				</pre>
			</Match>
		</Switch>
	)

	function GetToken() {
		console.log(`GetToken()`)

		const inputElement = (<input type="text" placeholder="token" />) as HTMLInputElement

		return (
			<>
				{inputElement}
				<button onClick={() => setToken(inputElement.value)}>Submit</button>
			</>
		)
	}
}

type ColourCode =
	| "a"
	| "b"
	| "c"
	| "d"
	| "e"
	| "f"
	| "g"
	| "h"
	| "i"
	| "j"
	| "k"
	| "l"
	| "m"
	| "n"
	| "o"
	| "p"
	| "q"
	| "r"
	| "s"
	| "t"
	| "u"
	| "v"
	| "w"
	| "x"
	| "y"
	| "z"
	| "A"
	| "B"
	| "C"
	| "D"
	| "E"
	| "F"
	| "G"
	| "H"
	| "I"
	| "J"
	| "K"
	| "L"
	| "M"
	| "N"
	| "O"
	| "P"
	| "Q"
	| "R"
	| "S"
	| "T"
	| "U"
	| "V"
	| "W"
	| "X"
	| "Y"
	| "Z"
	| "0"
	| "1"
	| "2"
	| "3"
	| "4"
	| "5"
	| "6"
	| "7"
	| "8"
	| "9"

const ColourCodes = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`

type HackmudMessagePart = { colourCode: ColourCode | undefined; content: string }

function* parseHackmudMessage(message: string): Generator<HackmudMessagePart, void, undefined> {
	let part: HackmudMessagePart = { colourCode: undefined, content: `` }

	for (let index = 0; index + 1 < message.length; index++) {
		const character = message[index]

		if (character == "`") {
			if (part.colourCode) {
				yield part
				part = { colourCode: undefined, content: `` }

				continue
			}

			if (ColourCodes.includes(message[index + 1])) {
				index++
				part.colourCode = message[index] as ColourCode
			}

			continue
		}

		part.content += character
	}

	part.content += message.slice(-1)

	if (part.colourCode && !message.endsWith("`"))
		yield { colourCode: undefined, content: `\`${part.colourCode}${part.content}` }

	// yield part
}
