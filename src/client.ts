import { requestUrl, RequestUrlResponse } from "obsidian";

const API_URL = process.env.API_URL || "http://localhost:3000";
const COOKIE_NAME = process.env.COOKIE_NAME || "accessToken";

interface PostContent {
	title: string;
	coverImageKey: string;
	formattedContent: string;
	bodyImageKeys: string[];
}

interface PublishResponse {
	postId: number;
}

type UpdatePostContent = Partial<PostContent> & { postId: number };

export default class Client {
	constructor(private readonly accessToken: string) {}

	async publishPost(post: PostContent): Promise<PublishResponse> {
		return this.makeRequest<PublishResponse, PostContent>("", "POST", post);
	}

	async updatePost(post: UpdatePostContent): Promise<PublishResponse> {
		return this.makeRequest<PublishResponse, UpdatePostContent>(
			`/${post.postId}`,
			"PUT",
			post,
		);
	}

	private async makeRequest<T, P = unknown>(
		endpoint: string,
		method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
		data?: P,
	): Promise<T> {
		try {
			const response: RequestUrlResponse = await requestUrl({
				url: `${API_URL}${endpoint}`,
				method,
				contentType: "application/json",
				body: data ? JSON.stringify(data) : undefined,
				headers: {
					Cookie: `${COOKIE_NAME}=${this.accessToken}`,
				},
			});

			if (!response.status.toString().startsWith("2")) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			if (response.arrayBuffer.byteLength > 0) return response?.json as T;
			return {} as T;
		} catch (error) {
			console.error("API request failed:", error);
			throw error;
		}
	}
}
