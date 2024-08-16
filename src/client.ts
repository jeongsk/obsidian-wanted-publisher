import { requestUrl } from "obsidian";

const API_URL = process.env.API_URL ?? "http://localhost:3000";
const COOKIE_NAME = process.env.COOKIE_NAME ?? "accessToken";

interface Post {
	title: string;
	coverImageKey: string;
	formattedContent: string;
	bodyImageKeys: string[];
}

export default class Client {
	constructor(private readonly accessToken: string) { }

	async publisher(post: Post) {
		return await requestUrl({
			url: API_URL,
			method: "POST",
			contentType: "application/json",
			body: JSON.stringify(post),
			headers: {
				"Cookie": `${COOKIE_NAME}=${this.accessToken}`
			}
		}).then((res) => res.json() as { postId: number });
	}
}
