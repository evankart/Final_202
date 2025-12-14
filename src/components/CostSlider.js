import { useState } from 'react';
import { useRange } from 'react-instantsearch';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const steps = [
    { pos: 0, value: 1 },
    { pos: 20, value: 5 },
    { pos: 40, value: 10 },
    { pos: 60, value: 25 },
    { pos: 80, value: 50 },
    { pos: 100, value: 100 }
];

const CostSlider = ({ attribute }) => {
    const { refine } = useRange({ attribute });
    const [sliderValues, setSliderValues] = useState([0, 100]);

    // convert slider value to actual value
    const sliderToValue = (sliderPos) => {
        for (let i = 0; i < steps.length - 1; i++) {
            const [lower, upper] = [steps[i], steps[i + 1]];
            if (sliderPos >= lower.pos && sliderPos <= upper.pos) {
                const ratio = (sliderPos - lower.pos) / (upper.pos - lower.pos);
                return lower.value + (upper.value - lower.value) * ratio;
            }
        }
        return steps[steps.length - 1].value;
    };

    const [min, max] = [sliderToValue(sliderValues[0]), sliderToValue(sliderValues[1])];

    const handleChange = (newValues) => {
        setSliderValues(newValues);
        const [minB, maxB] = [sliderToValue(newValues[0]), sliderToValue(newValues[1])];
        const lowerBound = newValues[0] <= 0 ? undefined : minB * 1e9;
        const upperBound = newValues[1] >= 100 ? undefined : maxB * 1e9;
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
                <span>${min.toFixed(1)}B</span>
                <span>${max.toFixed(1)}B{max >= 100 ? '+' : ''}</span>
            </div>
            <Slider
                range
                min={0}
                max={100}
                step={20}
                value={sliderValues}
                onChange={handleChange}
                marks={{ 0: '$1B', 20: '$5B', 40: '$10B', 60: '$25B', 80: '$50B', 100: '$100B+' }}
                trackStyle={[sliderStyles.track]}
                handleStyle={[sliderStyles.handle, sliderStyles.handle]}
                activeDotStyle={sliderStyles.activeDot}
            />
        </div>
    );
};

export default CostSlider;