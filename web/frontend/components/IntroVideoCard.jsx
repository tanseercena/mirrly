import { MediaCard, VideoThumbnail, Icon } from '@shopify/polaris'

import React, { useCallback, useEffect, useState,useContext } from "react"
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { AppContext } from "../components/providers/AppProvider.jsx";
import { XIcon } from "@shopify/polaris-icons";

export function IntroVideoCard ({title, video_link, description, onCancel}) {



    const { t } = useTranslation();
    const { primaryLocale } = useContext(AppContext);
    //   const [browserLanguage, setBrowserLanguage] = useState(primaryLocale)
    const [browserLanguage, setBrowserLanguage] = useState(primaryLocale);

    return (
        <>

            <div style={{ position: 'relative' }}>
                {onCancel && (
                    <button
                        onClick={onCancel}
                        style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            zIndex: 10,
                            background: 'transparent',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#F1F2F4';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                        }}
                        title={t("digtal_product_listing.cancel")}
                    >
                        <Icon source={XIcon} />
                    </button>
                )}
                <MediaCard
                    title={title}
                    primaryAction={{
                        content: t("createdigitalproduct.watch_tutorial"),
                        onAction: () => {
                            window.open(video_link, "_blank")
                        },
                    }}
                    description={description}
                >
                    <VideoThumbnail
                        videoLength={80}
                        thumbnailUrl="/images/guide.png"
                        onClick={() => window.open(video_link, "_blank")}
                    />
                </MediaCard>
            </div>

            <div style={{marginTop: "25px"}}></div>
        </>
    )
}