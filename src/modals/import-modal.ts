import { App, Modal } from "obsidian";

export default class ImportModal extends Modal {
	constructor(app: App, private readonly onSubmit: (url: string) => void) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl("h2", { text: "Import Post from URL" });

		const submitAction = () => {
			this.onSubmit(input.value);
			this.close();
		};

		const input = contentEl.createEl("input", {
			type: "text",
			placeholder: "Enter post URL",
			attr: {
				style: "width: calc(100% - 80px); margin-right: 10px",
			},
		});
		input.addEventListener("keydown", (event) => {
			if (event.key === "Enter") {
				event.preventDefault();
				submitAction();
			}
		});

		const submitButton = contentEl.createEl("button", {
			text: "Import",
		});
		submitButton.addEventListener("click", () => {
			submitAction();
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
