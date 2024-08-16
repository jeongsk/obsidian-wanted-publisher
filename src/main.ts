import {
	FrontMatterCache,
	MarkdownView,
	Notice,
	Plugin,
	TFile,
	stringifyYaml,
} from "obsidian";
import Client from "./client";
import { DEFAULT_SETTINGS, WantedPublisherPluginSettings } from "./constants";
import { getContentWithoutFrontmatter } from "./helpers/frontmatter";
import WantedPublisherSettingTab from "./setting-tab";

export default class WantedPublisherPlugin extends Plugin {
	settings: WantedPublisherPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: "publish",
			name: "Publish",
			callback: async () => {
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				const activeFile = markdownView?.file;
				if (!activeFile) {
					return new Notice(
						"No open note found. Please open a note to publish.",
					);
				}
				const title = activeFile.basename;
				const formattedContent = getContentWithoutFrontmatter(
					await this.app.vault.read(activeFile),
				);
				if (!formattedContent) {
					return new Notice(
						"Empty note. Please write something to publish.",
					);
				}

				const frontmatter =
					this.app.metadataCache.getFileCache(activeFile)
						?.frontmatter || {};
				const postId = frontmatter.socialPostId;

				const client = new Client(this.settings.token);

				if (postId) {
					await client.updatePost({
						postId,
						title,
						coverImageKey: "",
						formattedContent,
						bodyImageKeys: [],
					});
				} else {
					const results = await client.publishPost({
						title,
						coverImageKey: "",
						formattedContent,
						bodyImageKeys: [],
					});
					frontmatter["socialPostId"] = results.postId;
					const newFileContent = `---\n${stringifyYaml(frontmatter)}\n---\n${formattedContent}`;
					await this.app.vault.modify(activeFile, newFileContent);
				}
			},
		});

		this.addSettingTab(new WantedPublisherSettingTab(this.app, this));
	}

	async processFrontMatter(file: TFile): Promise<FrontMatterCache> {
		return new Promise((resolve) =>
			this.app.fileManager.processFrontMatter(file, resolve),
		);
	}

	async loadSettings() {
		this.settings = {
			...DEFAULT_SETTINGS,
			...(await this.loadData()),
		};
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
