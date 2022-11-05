// @refresh reload
import { Suspense } from "solid-js"
import { Body, ErrorBoundary, FileRoutes, Head, Html, Meta, Routes, Scripts, Title } from "solid-start"
import "./root.css"

export default function Root() {
	return (
		<Html lang="en">
			<Head>
				<Title>Hackmud Chat</Title>
				<Meta charset="utf-8" />
				<Meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>

			<Body>
				<Suspense>
					<ErrorBoundary>
						<Routes>
							<FileRoutes />
						</Routes>
					</ErrorBoundary>
				</Suspense>

				<Scripts />

				<div class="bg-red-400">
					<a href="https://github.com/samualtnorman/hackmud-chat-web">Open Source</a>
				</div>
			</Body>
		</Html>
	)
}
