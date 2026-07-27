import React from "react";

// Inline styles for better performance (no CSS file request)
const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#f6f6f7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
    },
    spinner: {
        width: '50px',
        height: '50px',
        border: '4px solid rgba(0, 0, 0, 0.1)',
        borderLeftColor: '#5C6AC4',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        willChange: 'transform',
    },
    loadingText: {
        color: '#202223',
        fontSize: '16px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        margin: 0,
        fontWeight: 400,
    }
};

// Inject keyframes once
if (typeof document !== 'undefined' && !document.getElementById('page-loader-keyframes')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'page-loader-keyframes';
    styleSheet.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styleSheet);
}

export const PageLoader = () => {
    return (
        <div style={styles.overlay}>
            <div style={styles.content}>
                <div style={styles.spinner}></div>

            </div>
        </div>
    );
};
