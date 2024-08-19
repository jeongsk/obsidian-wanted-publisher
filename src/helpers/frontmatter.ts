import { FrontMatterCache } from "obsidian";
import { FRONTMATTER_KEYS } from "src/constants";
import { FrontMatter } from "src/types";

export const getContentWithoutFrontmatter = (content = ""): string => {
	const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n/;
	return content.replace(frontmatterRegex, "").trim();
};

export function isFrontMatter(
	frontmatter: FrontMatter | FrontMatterCache,
): frontmatter is FrontMatter {
	return FRONTMATTER_KEYS.WS_POST_ID in frontmatter;
}
