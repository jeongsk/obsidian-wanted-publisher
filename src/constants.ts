export interface WantedPublisherPluginSettings {
	token: string;
}

export const DEFAULT_SETTINGS: WantedPublisherPluginSettings = {
	token: "",
};

export const FRONTMATTER_KEYS = {
	WS_POST_ID: "wsPostId",
	WS_TEAM_ID: "wsTeamId",
	WS_TITLE: "wsTitle",
	WS_COVER_IMAGE: "wsCoverImage",
} as const;
