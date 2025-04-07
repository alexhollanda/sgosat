import styles from './SidebarItem.module.css';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

export function SidebarItem({ texto, link, logo, colapsada }) {
    const location = useLocation();
    const isActive = location.pathname === link;

    const tooltip = (
        <Tooltip id={`tooltip-${texto}`}>{texto}</Tooltip>
    );

    const renderItem = (
        <Link
            to={link}
            className={clsx(styles.sidebar_item, {
                [styles.colapsada]: colapsada,
                [styles.active]: isActive
            })}
            aria-label={texto}
            aria-current={isActive ? 'page' : undefined}
        >
            <div className={styles.sidebar_item_icon}>{logo}</div>
            {!colapsada && <span className={styles.sidebar_item_text}>{texto}</span>}
        </Link>
    );

    return colapsada ? (
        <OverlayTrigger placement="right" overlay={tooltip}>
            {renderItem}
        </OverlayTrigger>
    ) : (
        renderItem
    );
}
