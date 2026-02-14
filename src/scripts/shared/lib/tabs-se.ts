import type { TypeOrNull } from '@scripts/shared/types';

export interface DefaultData {
	activeTab: TypeOrNull<HTMLElement>;
	activeItem: TypeOrNull<HTMLElement>;
}

interface TabsOptions {
	tabsName: string;
	defaultTab: number;
	tabsTriggerActiveClassName: string;
	tabsItemActiveClassName: string;
	enableNesting: boolean;
	onChanged: (data: DefaultData) => void;
	onLoaded: (data: DefaultData) => void;
}

export class TabsSE {
	private readonly _options: TabsOptions;
	private _tabs: HTMLElement;
	private readonly _tabsNav: HTMLElement;
	private _tabsContent: HTMLElement;
	private readonly _tabsTriggers: NodeListOf<HTMLElement>;
	private readonly _tabsItems: NodeListOf<HTMLElement>;

	constructor(tabsName: string, options: Partial<TabsOptions>) {
		const defaultOptions = {
			tabsName,
			defaultTab: 0,
			tabsTriggerActiveClassName: 'active',
			tabsItemActiveClassName: 'active',
			enableNesting: true,
			onChanged: () => {},
			onLoaded: () => {}
		};

		this._options = { ...defaultOptions, ...options };
		this._tabs = document.querySelector(`[data-tabs='${tabsName}']`) as HTMLElement;
		const scopeString = this._options.enableNesting ? ':scope > ' : '';
		this._tabsNav = this._tabs?.querySelector(`${scopeString}[data-tabs="navigate"]`) as HTMLElement;
		this._tabsContent = this._tabs?.querySelector(`${scopeString}[data-tabs="content"]`) as HTMLElement;
		this._tabsTriggers = this._tabsNav?.querySelectorAll<HTMLElement>(`${scopeString}[data-tabs="trigger"]`);
		this._tabsItems = this._tabsContent?.querySelectorAll<HTMLElement>(`${scopeString}[data-tabs="item"]`);

		this.init();
	}

	private init() {
		const { defaultTab, tabsTriggerActiveClassName } = this._options;
		const triggers = this._tabsTriggers ?? [];
		const items = this._tabsItems ?? [];
		const tabsNav = this._tabsNav;

		triggers.forEach((trigger, index) => {
			trigger.classList.toggle(tabsTriggerActiveClassName, index === defaultTab);

			trigger.onclick = (event) => {
				const currentTarget = event.currentTarget as HTMLElement;
				const currentTab = tabsNav.querySelector(`.${tabsTriggerActiveClassName}`) as HTMLElement;
				(currentTarget !== currentTab) && this.switchTabs(currentTarget, currentTab, index);
			};
		});

		items.forEach((item) => {
			const activeTrigger = tabsNav.querySelector(`.${tabsTriggerActiveClassName}`) as HTMLElement;
			this.toggleClassOnTabItem(activeTrigger, item);
		});

		this._options.onLoaded({
			activeTab: triggers[defaultTab],
			activeItem: items[defaultTab]
		});
	}

	private switchTabs(nextTab: HTMLElement, currentTab: HTMLElement, currentTabIndex: number) {
		const { tabsTriggerActiveClassName } = this._options;
		const tabItems = this._tabsItems;

		nextTab.classList.add(tabsTriggerActiveClassName);
		currentTab.classList.remove(tabsTriggerActiveClassName);

		tabItems.forEach((item) => this.toggleClassOnTabItem(nextTab, item));

		this._options.onChanged({
			activeTab: nextTab,
			activeItem: tabItems[currentTabIndex]
		});
	}

	private toggleClassOnTabItem(activeTab: HTMLElement, item: HTMLElement) {
		const { tabsItemActiveClassName } = this._options;
		const isAll = activeTab.dataset.valueTabs === 'all';

		if (isAll || item.dataset.type === activeTab.dataset.valueTabs) {
			item.classList.add(tabsItemActiveClassName);
		}
		else {
			item.classList.remove(tabsItemActiveClassName);
		}
	}
}
