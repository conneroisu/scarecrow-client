import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

import {simpleGit, CleanOptions, SimpleGit, SimpleGitOptions} from 'simple-git';


// Remember to rename these classes and interfaces!

interface ObsidianScarecrowClient {
	repository_url: string;
}

const DEFAULT_SETTINGS: ObsidianScarecrowClient = {
	repository_url: 'default url'
}

export default class ObsidianScarecrowClient extends Plugin {
	settings: ObsidianScarecrowClient;

	async onload() {
		await this.loadSettings();

		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new ObsidianScarecrowClientSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval') , 5 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async getRepoUrl() { 
		return this.settings.repository_url;
	} 
	
	async sync_vault_repo() {
		let repo_url = getRepoUrl();
		let repo = git.Repository.open(repo_url);
	}
}

class ObsidianScarecrowClientSettingTab extends PluginSettingTab {
	plugin: ObsidianScarecrowClient;

	constructor(app: App, plugin: ObsidianScarecrowClient) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for Obsidian Scarecrow Client.'});

		new Setting(containerEl)
			.setName('Repository URL')
			.setDesc('The github URL of the repository to sync with. (without the .git extension)')
			.addText(text => text
				.setPlaceholder('Enter the URL of the repository for this vault.')
				.setValue(this.plugin.settings.repository_url)
				.onChange(async (value) => {
					this.plugin.settings.repository_url = value;
					await this.plugin.saveSettings();
				}));
	}
}
