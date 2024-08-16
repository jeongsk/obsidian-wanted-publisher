export const getContentWithoutFrontmatter = (content = ""): string => {
	const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n/;
	return content.replace(frontmatterRegex, "").trim();
};
