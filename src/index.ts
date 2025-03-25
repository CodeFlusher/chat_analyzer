import { Elysia, t } from "elysia";
import { ChatBuilder } from "./chatBuilder";
import type { TgChat } from "../types";
import swagger from "@elysiajs/swagger";

const messages: TgChat = await Bun.file("result.json").json();

const app = new Elysia()
	.use(swagger())
	.get("/", () => "Hello Elysia")
	.get("/get", () => {
		const messagesNew = new ChatBuilder(messages.messages).build();
		return messagesNew;
	})
	.get(
		"/getBy",
		({ query: { name } }) => {
			const messagesNew = new ChatBuilder(messages.messages).by(name).build();
			return messagesNew;
		},
		{
			query: t.Object({
				name: t.String(),
			}),
		},
	)
	.listen(3000);

console.log(
	`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
