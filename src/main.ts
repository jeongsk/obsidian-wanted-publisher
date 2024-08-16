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

		this.addPublishCommand();

		this.addSettingTab(new WantedPublisherSettingTab(this.app, this));
	}

	private addPublishCommand() {
		this.addCommand({
			id: "publish",
			name: "Publish",
			callback: () => this.handlePublish(),
		});
	}

	private async handlePublish() {
		try {
			const activeFile = this.getActiveFile();

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
				this.app.metadataCache.getFileCache(activeFile)?.frontmatter ||
				{};
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
		} catch (err) {
			console.error(err);
			return new Notice(
				err.message ||
					"An error occurred while publishing. Please try again.",
			);
		}
	}

	private getActiveFile(): TFile {
		const markdownView =
			this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!markdownView?.file) {
			throw new Error(
				"No open note found. Please open a note to publish.",
			);
		}
		return markdownView.file;
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
