import tippy from 'tippy.js';
import type { TooltipLoaderOptions } from './types';
import { DEFAULT_OPTIONS } from './constants';

export class TooltipLoader {
    private static _instance: TooltipLoader;
    private readonly _options: Required<TooltipLoaderOptions>;

    private constructor(options: TooltipLoaderOptions = {}) {
        this._options = { ...DEFAULT_OPTIONS, ...options };
        this.update();
    }

    public static getInstance(options: TooltipLoaderOptions = {}): TooltipLoader {
        return this._instance ??= new TooltipLoader(options);
    }

    public update() {
        const { elementDataAttr, tippyOptions } = this._options;
        tippy(`[${elementDataAttr}]`, tippyOptions);
    }
}