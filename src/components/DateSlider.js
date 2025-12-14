import { useState } from 'react';
import { useRange } from 'react-instantsearch';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const DateSlider = ({ attribute }) => {
    const { refine } = useRange({ attribute });
    const [dateValues, setDateValues] = useState([1950, 2025]);

    // get year start/end timestamps for filtering
    const yearToTimestamp = (year, isEnd = false) => {
        return new Date(year, isEnd ? 11 : 0, isEnd ? 31 : 1).getTime();
    };

    const handleChange = (newValues) => {
        setDateValues(newValues);
        const lowerBound = newValues[0] <= 1950 ? undefined : yearToTimestamp(newValues[0]);
        const upperBound = newValues[1] >= 2025 ? undefined : yearToTimestamp(newValues[1], true);
        refine([lowerBound, upperBound]);
    };

    const primary = '#0d6efd';
    const sliderStyles = {
        track: { backgroundColor: primary },
        handle: { backgroundColor: primary, borderColor: primary, opacity: 1 },
        rail: { backgroundColor: '#e0e0e0' },
        dot: { backgroundColor: '#ccc', borderColor: '#ccc' },
        activeDot: { backgroundColor: primary, borderColor: primary }
    };

    return (
        <div className='mb-3 mx-3'>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '15px' }}>
                <span>{dateValues[0]}</span>
                <span>{dateValues[1]}</span>
            </div>
            <Slider
                range
                min={1950}
                max={2025}
                step={1}
                value={dateValues}
                onChange={handleChange}
                marks={{ 1950: '1950', 1975: '1975', 2000: '2000', 2025: '2025' }}
                trackStyle={[sliderStyles.track]}
                handleStyle={[sliderStyles.handle, sliderStyles.handle]}
                activeDotStyle={sliderStyles.activeDot}
            />
        </div>
    );
};

export default DateSlider;