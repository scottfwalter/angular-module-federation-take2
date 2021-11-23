import { IconSvgService } from 'cxone-client-services-platform';

export const iconLoaderFactory = () => {
    return async () => await IconSvgService.instance.loadAllIconsSprite();
};
