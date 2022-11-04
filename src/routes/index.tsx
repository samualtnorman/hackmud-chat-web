import { createEffect, createSignal, Match, Show, Switch } from "solid-js"
import { trpc } from "~/utils/trpc"

export default () => {
	const [getToken, setToken] = createSignal(localStorage.getItem(`token`))

	createEffect(() => localStorage.setItem(`token`, getToken()!))

	return (
		<Show
			when={getToken()}
			fallback={
				<>
					<p>Enter your token</p>
					<GetToken />
				</>
			}
		>
			<HasToken />
		</Show>
	)

	function GetToken() {
		console.log(`GetToken()`)

		const inputElement = (<input type="text" placeholder="token" />) as HTMLInputElement

		return (
			<>
				{inputElement}
				<button onClick={() => setToken(inputElement.value)}>submit</button>
			</>
		)
	}

	function HasToken() {
		console.log(`HasToken()`)

		const tokenIsValid = trpc.isTokenValid.useQuery(getToken()!)

		return (
			<Switch
				fallback={
					<>
						<p>Expired or invalid token</p>
						<GetToken />
					</>
				}
			>
				<Match when={tokenIsValid.isLoading}>
					<p>Loading</p>
				</Match>

				<Match when={tokenIsValid.data}>
					<TokenValid />
				</Match>
			</Switch>
		)
	}

	function TokenValid() {
		console.log(`TokenValid()`)

		const channelData = trpc.getChannelData.useQuery(getToken()!)

		return (
			<Show when={channelData.isFetched} fallback={<p>Loading</p>}>
				<HasChannelData />
			</Show>
		)

		function HasChannelData() {
			console.log(`HasChannelData()`)
			console.log(channelData.data)

			return <></>

			// const messages = trpc.getMessagesBefore.useQuery(
			// 	{ token: getToken()!, users: Object.keys(channelData.data!.users), date: new Date() },
			// 	{ refetchOnWindowFocus: false }
			// )

			// return <Show when={messages.isFetched} fallback={<p>Loading</p>}>
			// 	<For each={messages.data}>
			// 		{message => {
			// 			return message.content
			// 		}}
			// 	</For>
			// </Show>
		}
	}
}
