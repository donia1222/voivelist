import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';

const TypingText = ({ text, style }) => {
    const [displayedText, setDisplayedText] = useState('');
    const typingSpeed = 20;  // ms per character

    useEffect(() => {
        if (displayedText.length < text.length) {
            setTimeout(() => {
                setDisplayedText(text.slice(0, displayedText.length + 1));
            }, typingSpeed);
        }
    }, [displayedText]);

    return <Text style={style}>{displayedText}</Text>;
};

export default TypingText;
