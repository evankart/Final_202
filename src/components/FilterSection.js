import { useState, useRef, useEffect } from 'react';

const FilterSection = ({ title, filterName, isOpen, onToggle, children }) => {
    const contentRef = useRef(null);
    const [maxHeight, setMaxHeight] = useState(0);

    useEffect(() => {
        if (isOpen && contentRef.current) {
            const height = contentRef.current.getBoundingClientRect().height;
            setMaxHeight(prev => Math.max(prev, height));
        }
    }, [isOpen]);

    const titleStyles = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        padding: '12px 16px'
    };

    const contentStyles = {
        backgroundColor: '#ffffff',
        padding: '12px 16px',
        minHeight: isOpen ? maxHeight : 0
    };

    return (
        <div className={`filter-section ${isOpen ? 'is-open' : 'is-closed'}`}>
            <div style={titleStyles} className='filter-title' onClick={() => onToggle(filterName)}>
                <h3 style={{ margin: 0 }}>{title}</h3>
                <span className='text-primary'>{isOpen ? '[−]' : '[+]'}</span>
            </div>
            {isOpen && <div ref={contentRef} style={contentStyles}>{children}</div>}
        </div>
    );
};

export default FilterSection;