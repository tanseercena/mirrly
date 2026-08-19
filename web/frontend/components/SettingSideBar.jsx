import { BlockStack, Text, Icon } from "@shopify/polaris";
import { useNavigate, useLocation } from "react-router-dom";
import React from "react";
import "./Styles.css";
import {useTranslation} from "react-i18next";
import i18next from "i18next";

import {
  EmailIcon,CollectionListIcon,FolderDownIcon,DeliveryIcon,FileIcon,ContractIcon,ChannelsIcon, TransactionIcon, ChartLineIcon
} from '@shopify/polaris-icons';

const SettingSideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation()

    return (
        <div style={{}}>
            <BlockStack gap="0">
                <Text variant="bodyMd" as="p" tone="subdued">
                    {t("settings.no_sub_settings_available")}
                </Text>
            </BlockStack>
        </div>
    );
};

export default SettingSideBar;
