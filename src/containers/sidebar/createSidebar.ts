import { SIDEBAR } from '@/config/config';
import { SmartSidebar } from '@containers/sidebar/sidebar';

const createSidebar = () => {
    let sidebar: SmartSidebar | undefined;

    const create = () => {
        sidebar = new SmartSidebar({
            parent: SIDEBAR(),
        });
    };

    return () => {
        if (!sidebar) {
            create();
        }

        return {
            destroy: () => {
                sidebar?.destroy();
                sidebar = undefined;
            },
        };
    };
};

export const getSidebar = createSidebar();
