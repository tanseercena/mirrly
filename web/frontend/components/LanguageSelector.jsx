import React, {
    useState,
    useEffect,
    useContext,
    useRef,
    useCallback,
} from "react";
import { AppContext } from "./providers/AppProvider";
import {Select, Icon} from '@shopify/polaris';
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { ChatIcon } from '@shopify/polaris-icons';
const LanguageSelector = ({homepage}) => {
    const { t } = useTranslation();
    const { primaryLocale, currentLanguage, setCurrentLanguage } = useContext(AppContext);
    const [browserLanguage, setBrowserLanguage] = useState(currentLanguage);

const languageOptions = [
    { label: "English", value: "en" },
    { label: "Spanish", value: "es" },
    { label: "French", value: "fr" },
    { label: "German", value: "de" },
    { label: "Danish", value: "da" },
    { label: "Portuguese", value: "pt" },
    { label: "Dutch", value: "nl" },
    { label: "Swedish", value: "sv" },
    { label: "Chinese", value: "zh" },
];

const changeLanguage = async (lng) => {
    setBrowserLanguage(lng);
    setCurrentLanguage(lng);
    i18next.changeLanguage(lng);

    // Save language preference to database
    try {
        const response = await fetch('/api/update-language', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ language: lng }),
        });

        if (response.ok) {
            console.log('Language preference saved successfully');
        } else {
            console.error('Failed to save language preference');
        }
    } catch (error) {
        console.error('Error saving language preference:', error);
    }
};

React.useEffect(() => {
    // Use currentLanguage from context, fallback to primaryLocale or i18next language
    let lang = currentLanguage || primaryLocale || i18next.language;
    setBrowserLanguage(lang);
    if (lang !== i18next.language) {
        i18next.changeLanguage(lang);
    }
}, [currentLanguage, primaryLocale]);
    const openChat = () => {
        if (window.$crisp) {
            // Show the Crisp widget if it's hidden (mobile)
            const crispBox = document.getElementById("crisp-chatbox");
            if (crispBox) {
                crispBox.style.setProperty("display", "block", "important");
                // Also show any hidden iframes inside
                const iframes = crispBox.querySelectorAll("iframe");
                iframes.forEach((iframe) => {
                    iframe.style.setProperty("display", "block", "important");
                });
            }

            // Open the chat
            window.$crisp.push(['do', 'chat:open']);
        } else {
            console.warn('Crisp is not loaded yet');
        }
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                    gap: "12px",
                }}
            >
                <button
                    onClick={openChat}
                    className="mobile-chat-button"
                    aria-label="Chat with us"
                >
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ color: 'white' }}
                    >
                        <path
                            d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
                <Select
                    label={""}
                    labelHidden={true}
                    options={languageOptions}
                    onChange={(value) => changeLanguage(value)}
                    value={browserLanguage}
                    style={{ width: "100%", minWidth: "300px" }}
                />
            </div>
            <style>{`
                .mobile-chat-button {
                    display: none;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
                    transition: all 0.2s ease;
                }
                .mobile-chat-button:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
                }
                .mobile-chat-button:active {
                    transform: scale(0.95);
                }
                @media (max-width: 768px) {
                    .mobile-chat-button {
                        display: flex;
                    }
                }
            `}</style>
        </div>
    );
};

export default LanguageSelector;
