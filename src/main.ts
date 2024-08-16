import { App, MarkdownView, Modal, Notice, Plugin } from "obsidian";
import { DEFAULT_SETTINGS, WantedPublisherPluginSettings } from "./constants";
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
				if (!markdownView?.file) {
					return new Notice(
						"No open note found. Please open a note to publish.",
					);
				}
				const body = await this.app.vault.read(markdownView?.file);
				if (!body?.trim()) {
					return new Notice("Empty note. Please write something to publish.");
				}

				console.log(body);
			},
		});

		this.addSettingTab(new WantedPublisherSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = {
			...DEFAULT_SETTINGS,
			...await this.loadData()
		};
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
