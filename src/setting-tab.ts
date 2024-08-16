import { PluginSettingTab, App, Setting } from "obsidian";
import WantedPublisherPlugin from "./main";

export default class WantedPublisherSettingTab extends PluginSettingTab {
	plugin: WantedPublisherPlugin;

	constructor(app: App, plugin: WantedPublisherPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Access Token")
			.setDesc(
				"Enter the authentication token to access the Wanted service.",
			)
			.addText((text) => {
				text.inputEl.type = "password";
				return text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.token)
					.onChange(async (value) => {
						this.plugin.settings.token = value;
						await this.plugin.saveSettings();
					});
			});
	}
}
