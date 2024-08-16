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

export default class Client {
    constructor(private readonly accessToken: string) {}

    async publishPost(post: PostContent): Promise<PublishResponse> {
        const response = await this.makeRequest<PublishResponse>("/publish", post);
        return response;
    }

    private async makeRequest<T, P = any>(endpoint: string, data: P): Promise<T> {
        const response: RequestUrlResponse = await requestUrl({
            url: `${API_URL}${endpoint}`,
			method: "POST",
			contentType: "application/json",
            body: JSON.stringify(data),
			headers: {
				"Cookie": `${COOKIE_NAME}=${this.accessToken}`
			}
        });

        return response.json as T;
	}
}
