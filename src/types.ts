import { FrontMatterCache } from "obsidian";
import { FRONTMATTER_KEYS } from "./constants";

export type FrontMatterKeys =
	(typeof FRONTMATTER_KEYS)[keyof typeof FRONTMATTER_KEYS];

export type FrontMatter = FrontMatterCache & {
	[FRONTMATTER_KEYS.WS_POST_ID]: number;
	[FRONTMATTER_KEYS.WS_TEAM_ID]: number;
	[FRONTMATTER_KEYS.WS_TITLE]: string;
};
