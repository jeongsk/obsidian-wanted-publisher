import {
	FrontMatterCache,
	MarkdownView,
	Notice,
	Plugin,
	TFile,
	stringifyYaml,
} from "obsidian";
import Client from "./apis/client";
import {
	DEFAULT_SETTINGS,
	FRONTMATTER_KEYS,
	WantedPublisherPluginSettings,
} from "./constants";
import {
	getContentWithoutFrontmatter,
	isFrontMatter,
} from "./helpers/frontmatter";
import WantedPublisherSettingTab from "./setting-tab";
import { FrontMatter } from "./types";
import ConfirmPublishModal from "./modals/confirm-publish-modal";
import type { PostContent, PostDetail } from "./apis/models";
import ImportModal from "./modals/import-modal";
import { moment } from "obsidian";

export default class WantedPublisherPlugin extends Plugin {
	settings: WantedPublisherPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommands();

		this.addSettingTab(new WantedPublisherSettingTab(this.app, this));
	}

	private addCommands() {
		this.addCommand({
			id: "publish",
			name: "Publish",
			callback: () => this.handlePublish(),
		});

		this.addCommand({
			id: "import-post",
			name: "Import post from URL",
			callback: () => {
				new ImportModal(this.app, (url) => this.importPost(url)).open();
			},
		});
	}

	private async importPost(url: string) {
		try {
			const client = new Client(this.settings.token);
			const postId = Number(url.split("/").last());
			const post = await client.getPost(postId);
			console.log(post);

			if (post) {
				const file = await this.createNoteFile(post);

				this.app.workspace.getLeaf().openFile(file);

				new Notice("Post imported successfully!");
			} else {
				new Notice("Failed to import post. Post not found.");
			}
		} catch (error) {
			console.error("Error importing post:", error);
			new Notice("Failed to import post. See console for details.");
		}
	}

	private async createNoteFile(post: PostDetail) {
		const frontmatter = {
			wsPostId: post.id,
			wsTitle: post.title,
			wsCoverImage: post.coverImage,
			wsCreatedAt: moment(post.createdAt).format("YYYY-MM-DD HH:mm:ss"),
		};
		const fileContent = `---\n${stringifyYaml(frontmatter)}\n---\n${
			post.formattedContent
		}`;
		try {
			return await this.app.vault.create(`${post.title}.md`, fileContent);
		} catch (err) {
			if (err.message.includes("File already exists")) {
				return await this.app.vault.create(
					`${post.title}(2).md`,
					fileContent
				);
			}
			throw err;
		}
	}

	private async handlePublish() {
		try {
			const activeFile = this.getActiveFile();

			const { formattedContent, frontmatter } =
				await this.preparePublishData(activeFile);

			await this.publishOrUpdatePost(
				activeFile,
				formattedContent,
				frontmatter
			);
		} catch (err) {
			console.error(err);
			return new Notice(
				err.message ||
					"An error occurred while publishing. Please try again."
			);
		}
	}

	private async publishOrUpdatePost(
		file: TFile,
		formattedContent: string,
		frontmatter: FrontMatter | FrontMatterCache
	) {
		const client = new Client(this.settings.token);

		const hasImages = await this.checkForImages(file);
		if (hasImages) {
			console.log("This file contains embedded images.", hasImages);
			// 여기에 이미지가 포함된 경우의 추가 로직을 구현할 수 있습니다
		}

		const filename = file.basename.slice(0, 50);
		if (isFrontMatter(frontmatter) && frontmatter.wsPostId) {
			await this.updateExistingPost(client, frontmatter.wsPostId, {
				title: frontmatter.wsTitle || filename,
				formattedContent,
			});
		} else {
			await this.createNewPost(client, file, frontmatter, {
				title: filename,
				formattedContent,
			});
		}
	}

	private async confirmPublish(initialTitle: string): Promise<string> {
		return new Promise((resolve) => {
			const modal = new ConfirmPublishModal(
				this.app,
				initialTitle,
				(result) => {
					resolve(result);
				}
			);
			modal.open();
		});
	}

	private async createNewPost(
		client: Client,
		file: TFile,
		frontmatter: FrontMatter | FrontMatterCache,
		post: Partial<PostContent> &
			Pick<PostContent, "title" | "formattedContent">
	) {
		try {
			const confirmedTitle = await this.confirmPublish(post.title);
			const results = await client.publishPost({
				title: confirmedTitle,
				coverImageKey: post.coverImageKey ?? "",
				formattedContent: post.formattedContent,
				bodyImageKeys: post.bodyImageKeys ?? [],
			});
			frontmatter[FRONTMATTER_KEYS.WS_POST_ID] = results.postId;
			frontmatter[FRONTMATTER_KEYS.WS_TITLE] = confirmedTitle;
			const newFileContent = `---\n${stringifyYaml(frontmatter)}\n---\n${
				post.formattedContent
			}`;
			await this.app.vault.modify(file, newFileContent);
			return new Notice("Post created successfully!");
		} catch (err) {
			console.error(err);
		}
	}

	private async updateExistingPost(
		client: Client,
		postId: number,
		post: Partial<PostContent> &
			Pick<PostContent, "title" | "formattedContent">
	) {
		await client.updatePost(postId, {
			title: post.title,
			coverImageKey: post.coverImageKey ?? "",
			formattedContent: post.formattedContent,
			bodyImageKeys: post.bodyImageKeys ?? [],
		});
		return new Notice("Post updated successfully!");
	}

	private getActiveFile(): TFile {
		const markdownView =
			this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!markdownView?.file) {
			throw new Error(
				"No open note found. Please open a note to publish."
			);
		}
		return markdownView.file;
	}

	private async checkForImages(file: TFile): Promise<boolean> {
		// 파일의 메타데이터 캐시를 가져옵니다
		const cache = this.app.metadataCache.getFileCache(file);

		if (cache && cache.embeds) {
			// 임베드된 파일 중 이미지 파일만 필터링합니다
			const imageEmbeds = cache.embeds.filter((embed) => {
				const extension =
					embed.link.split(".").pop()?.toLowerCase() ?? "";
				return ["png", "jpg", "jpeg", "gif", "bmp", "svg"].includes(
					extension
				);
			});

			// 이미지 임베드가 하나 이상 있으면 true를 반환합니다
			return imageEmbeds.length > 0;
		}

		return false;
	}

	private async preparePublishData(file: TFile): Promise<{
		formattedContent: string;
		frontmatter: FrontMatterCache;
	}> {
		const content = await this.app.vault.read(file);
		const formattedContent = getContentWithoutFrontmatter(content);
		if (!formattedContent) {
			throw new Error("Empty note. Please write something to publish.");
		}
		const frontmatter =
			this.app.metadataCache.getFileCache(file)?.frontmatter || {};
		return { formattedContent, frontmatter };
	}

	async processFrontMatter(file: TFile): Promise<FrontMatterCache> {
		return new Promise((resolve) =>
			this.app.fileManager.processFrontMatter(file, resolve)
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
