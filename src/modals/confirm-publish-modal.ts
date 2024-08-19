import { App, Modal, Setting } from "obsidian";

export default class ConfirmPublishModal extends Modal {
	result: string;
	onSubmit: (result: string) => void;

	constructor(
		app: App,
		initialTitle: string,
		onSubmit: (result: string) => void
	) {
		super(app);
		this.result = initialTitle;
		this.onSubmit = onSubmit;
	}

	onOpen() {
		const { contentEl } = this;

		contentEl.createEl("h1", { text: "Confirm Post" });

		new Setting(contentEl).setName("Title").addText((text) => {
			text.setValue(this.result)
				.setPlaceholder("Enter title (max 50 characters)")
				.onChange((value) => {
					this.result = value;
				})
				.then((t) => {
					t.inputEl.style.width = "100%";
					t.inputEl.maxLength = 50;
				});
		});

		new Setting(contentEl).addButton((btn) =>
			btn
				.setButtonText("Submit")
				.setCta()
				.onClick(() => {
					this.close();
					this.onSubmit(this.result);
				})
		);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
