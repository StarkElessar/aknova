import type { FancyboxOptions } from '@fancyapps/ui/dist/fancybox/fancybox';
import type { TypeOrNull } from '@scripts/shared/types';

export type UnmountLoader = () => void;

export interface ThumbImage {
    src: string;
    thumbSrc?: string;
    caption?: string;
    thumbAlt?: string;
    thumbClass?: string;
}

export interface IVirtualGalleryItem {
    galleryContainerAttr: string;
    images: ThumbImage[];
}

export interface FancyboxLoaderOptions {
    cssUrl?: string;
    /**
     * Атрибут для триггеров Fancybox. Элементы с ОДИНАКОВЫМ значением этого атрибута
     * объединяются в галерею. При клике открывается слайдер с элементами из той же группы.
     *
     * @example
     * <!-- Галерея 1 -->
     * <a href="car1.jpg" data-custom-gallery="cars">
     *   <img src="car1-thumb.jpg" alt="">
     * </a>
     * <a href="car2.jpg" data-custom-gallery="cars">
     *   <img src="car2-thumb.jpg" alt="">
     * </a>
     *
     * <!-- Галерея 2 -->
     * <a href="horse1.jpg" data-custom-gallery="horses">
     *   <img src="horse1-thumb.jpg" alt="">
     * </a>
     *
     * // Инициализация
     * FancyboxLoader.init({
     *   containerDataAttr: 'data-custom-gallery' // без указания значения!
     * });
     *
     * @default 'data-fancybox'
     * */
    containerDataAttr?: string;
    fancyboxOptions?: Partial<FancyboxOptions>;
    loaderTemplate?: TypeOrNull<() => UnmountLoader>;
    virtualGalleryItems?: IVirtualGalleryItem[];
}
