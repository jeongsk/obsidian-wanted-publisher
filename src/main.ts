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

			const { title, formattedContent, frontmatter } =
				await this.preparePublishData(activeFile);

			await this.publishOrUpdatePost(
				activeFile,
				title,
				formattedContent,
				frontmatter,
			);
		} catch (err) {
			console.error(err);
			return new Notice(
				err.message ||
					"An error occurred while publishing. Please try again.",
			);
		}
	}

	private async publishOrUpdatePost(
		file: TFile,
		title: string,
		formattedContent: string,
		frontmatter: any,
	) {
		const client = new Client(this.settings.token);
		const postId = frontmatter.socialPostId;

		if (postId) {
			await this.updateExistingPost(
				client,
				postId,
				title,
				formattedContent,
			);
		} else {
			await this.createNewPost(
				client,
				file,
				title,
				formattedContent,
				frontmatter,
			);
		}
	}

	private async createNewPost(
		client: Client,
		file: TFile,
		title: string,
		formattedContent: string,
		frontmatter: any,
	) {
		const results = await client.publishPost({
			title,
			coverImageKey: "",
			formattedContent,
			bodyImageKeys: [],
		});
		frontmatter["socialPostId"] = results.postId;
		const newFileContent = `---\n${stringifyYaml(frontmatter)}\n---\n${formattedContent}`;
		await this.app.vault.modify(file, newFileContent);
		return new Notice("Post created successfully!");
	}

	private async updateExistingPost(
		client: Client,
		postId: number,
		title: string,
		formattedContent: string,
	) {
		await client.updatePost(postId, {
			title,
			coverImageKey: "",
			formattedContent,
			bodyImageKeys: [],
		});
		return new Notice("Post updated successfully!");
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

	private async preparePublishData(file: TFile): Promise<{
		title: string;
		formattedContent: string;
		frontmatter: FrontMatterCache;
	}> {
		const title = file.basename.slice(0, 50);
		const content = await this.app.vault.read(file);
		const formattedContent = getContentWithoutFrontmatter(content);
		if (!formattedContent) {
			throw new Error("Empty note. Please write something to publish.");
		}
		const frontmatter =
			this.app.metadataCache.getFileCache(file)?.frontmatter || {};
		return { title, formattedContent, frontmatter };
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
