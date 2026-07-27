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
    const urll = "/Settings/Lottery";
    const { t } = useTranslation()

    return (
        <div style={{}}>
            <BlockStack gap="0">
                {/* Email Settings */}
                <div
                    onClick={() => navigate('/Settings/Email')}
                    style={{
                        padding: '8px 16px',
                        cursor: 'pointer',
                        backgroundColor: location.pathname === '/Settings/Email' ? '#f3f4f6' : 'transparent',
                        borderLeft: location.pathname === '/Settings/Email' ? '4px solid #1a1a1a' : '4px solid transparent',
                        borderRadius: '0 4px 4px 0'
                    }}
                >
                    <table style={{ borderCollapse: 'collapse', borderSpacing: 0, width: '100%' }}>
                        <tbody>
                            <tr>
                                <td style={{ verticalAlign: 'middle', paddingRight: '10px', width: '20px' }}>
                                    <Icon source={EmailIcon} />
                                </td>
                                <td style={{ verticalAlign: 'middle', textAlign: 'left' }}>
                                    <Text
                                        fontWeight={location.pathname === '/Settings/Email' ? 'bold' : 'regular'}
                                        tone={location.pathname === '/Settings/Email' ? 'text' : 'subdued'}
                                    >
                                        {t("settings.email_content.title")}
                                    </Text>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Lottery Settings */}
                {/* <div
                    onClick={() => navigate('/Settings/Lottery')}
                    style={{
                        padding: '8px 16px',
                        cursor: 'pointer',
                        backgroundColor: location.pathname === '/Settings/Lottery' ? '#f3f4f6' : 'transparent',
                        borderLeft: location.pathname === '/Settings/Lottery' ? '4px solid #1a1a1a' : '4px solid transparent',
                        borderRadius: '0 4px 4px 0'
                    }}
                >
                    <table style={{ borderCollapse: 'collapse', borderSpacing: 0, width: '100%' }}>
                        <tbody>
                            <tr>
                                <td style={{ verticalAlign: 'middle', paddingRight: '10px', width: '20px' }}>
                                    <Icon source={CollectionListIcon} />
                                </td>
                                <td style={{ verticalAlign: 'middle', textAlign: 'left' }}>
                                    <Text
                                        fontWeight={location.pathname === '/Settings/Lottery' ? 'bold' : 'regular'}
                                        tone={location.pathname === '/Settings/Lottery' ? 'text' : 'subdued'}
                                    >
                                        {t("settings.lottery_content.title")}
                                    </Text>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div> */}

                {/* Download Settings */}
                <div
                    onClick={() => navigate('/Settings/Download')}
                    style={{
                        padding: '8px 16px',
                        cursor: 'pointer',
                        backgroundColor: location.pathname === '/Settings/Download' ? '#f3f4f6' : 'transparent',
                        borderLeft: location.pathname === '/Settings/Download' ? '4px solid #1a1a1a' : '4px solid transparent',
                        borderRadius: '0 4px 4px 0'
                    }}
                >
                    <table style={{ borderCollapse: 'collapse', borderSpacing: 0, width: '100%' }}>
                        <tbody>
                            <tr>
                                <td style={{ verticalAlign: 'middle', paddingRight: '10px', width: '20px' }}>
                                    <Icon source={FolderDownIcon} />
                                </td>
                                <td style={{ verticalAlign: 'middle', textAlign: 'left' }}>
                                    <Text
                                        fontWeight={location.pathname === '/Settings/Download' ? 'bold' : 'regular'}
                                        tone={location.pathname === '/Settings/Download' ? 'text' : 'subdued'}
                                    >
                                        {t("settings.download_page.title_")}
                                    </Text>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Order Delivery Settings */}
                <div
                    onClick={() => navigate('/Settings/OrderDelivery')}
                    style={{
                        padding: '8px 16px',
                        cursor: 'pointer',
                        backgroundColor: location.pathname === '/Settings/OrderDelivery' ? '#f3f4f6' : 'transparent',
                        borderLeft: location.pathname === '/Settings/OrderDelivery' ? '4px solid #1a1a1a' : '4px solid transparent',
                        borderRadius: '0 4px 4px 0'
                    }}
                >
                    <table style={{ borderCollapse: 'collapse', borderSpacing: 0, width: '100%' }}>
                        <tbody>
                            <tr>
                                <td style={{ verticalAlign: 'middle', paddingRight: '10px', width: '20px' }}>
                                    <Icon source={DeliveryIcon} />
                                </td>
                                <td style={{ verticalAlign: 'middle', textAlign: 'left' }}>
                                    <Text
                                        fontWeight={location.pathname === '/Settings/OrderDelivery' ? 'bold' : 'regular'}
                                        tone={location.pathname === '/Settings/OrderDelivery' ? 'text' : 'subdued'}
                                    >
                                        {t("settings.order_delivery.title_side")}
                                    </Text>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* PDF Stamping Settings */}
                <div
                    onClick={() => navigate('/Settings/PdfStamping')}
                    style={{
                        padding: '8px 16px',
                        cursor: 'pointer',
                        backgroundColor: location.pathname === '/Settings/PdfStamping' ? '#f3f4f6' : 'transparent',
                        borderLeft: location.pathname === '/Settings/PdfStamping' ? '4px solid #1a1a1a' : '4px solid transparent',
                        borderRadius: '0 4px 4px 0'
                    }}
                >
                    <table style={{ borderCollapse: 'collapse', borderSpacing: 0, width: '100%' }}>
                        <tbody>
                            <tr>
                                <td style={{ verticalAlign: 'middle', paddingRight: '10px', width: '20px' }}>
                                    <Icon source={FileIcon} />
                                </td>
                                <td style={{ verticalAlign: 'middle', textAlign: 'left' }}>
                                    <Text
                                        fontWeight={location.pathname === '/Settings/PdfStamping' ? 'bold' : 'regular'}
                                        tone={location.pathname === '/Settings/PdfStamping' ? 'text' : 'subdued'}
                                    >
                                        {t("settings.pdf_stamping_security.title")}
                                    </Text>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Track License Keys Settings */}
                <div
                    onClick={() => navigate('/Settings/TrackLicenseKeys')}
                    style={{
                        padding: '8px 16px',
                        cursor: 'pointer',
                        backgroundColor: location.pathname === '/Settings/TrackLicenseKeys' ? '#f3f4f6' : 'transparent',
                        borderLeft: location.pathname === '/Settings/TrackLicenseKeys' ? '4px solid #1a1a1a' : '4px solid transparent',
                        borderRadius: '0 4px 4px 0'
                    }}
                >
                    <table style={{ borderCollapse: 'collapse', borderSpacing: 0, width: '100%' }}>
                        <tbody>
                            <tr>
                                <td style={{ verticalAlign: 'middle', paddingRight: '10px', width: '20px' }}>
                                    <Icon source={ContractIcon} />
                                </td>
                                <td style={{ verticalAlign: 'middle', textAlign: 'left' }}>
                                    <Text
                                        fontWeight={location.pathname === '/Settings/TrackLicenseKeys' ? 'bold' : 'regular'}
                                        tone={location.pathname === '/Settings/TrackLicenseKeys' ? 'text' : 'subdued'}
                                    >
                                        {t("settings.track_license_keys.title")}
                                    </Text>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Track License Keys Settings */}
                <div
                    onClick={() => navigate('/Settings/Integrations')}
                    style={{
                        padding: '8px 16px',
                        cursor: 'pointer',
                        backgroundColor: location.pathname === '/Settings/Integrations' ? '#f3f4f6' : 'transparent',
                        borderLeft: location.pathname === '/Settings/Integrations' ? '4px solid #1a1a1a' : '4px solid transparent',
                        borderRadius: '0 4px 4px 0'
                    }}
                >
                    <table style={{ borderCollapse: 'collapse', borderSpacing: 0, width: '100%' }}>
                        <tbody>
                            <tr>
                                <td style={{ verticalAlign: 'middle', paddingRight: '10px', width: '20px' }}>
                                    <Icon source={ChannelsIcon} />
                                </td>
                                <td style={{ verticalAlign: 'middle', textAlign: 'left' }}>
                                    <Text
                                        fontWeight={location.pathname === '/Settings/Integrations' ? 'bold' : 'regular'}
                                        tone={location.pathname === '/Settings/Integrations' ? 'text' : 'subdued'}
                                    >
                                        {t("settings.integrations.title")}
                                    </Text>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Order API Settings */}
                <div
                    onClick={() => navigate('/Settings/OrderAPI')}
                    style={{
                        padding: '8px 16px',
                        cursor: 'pointer',
                        backgroundColor: location.pathname === '/Settings/OrderAPI' ? '#f3f4f6' : 'transparent',
                        borderLeft: location.pathname === '/Settings/OrderAPI' ? '4px solid #1a1a1a' : '4px solid transparent',
                        borderRadius: '0 4px 4px 0'
                    }}
                >
                    <table style={{ borderCollapse: 'collapse', borderSpacing: 0, width: '100%' }}>
                        <tbody>
                            <tr>
                                <td style={{ verticalAlign: 'middle', paddingRight: '10px', width: '20px' }}>
                                    <Icon source={TransactionIcon} />
                                </td>
                                <td style={{ verticalAlign: 'middle', textAlign: 'left' }}>
                                    <Text
                                        fontWeight={location.pathname === '/Settings/OrderAPI' ? 'bold' : 'regular'}
                                        tone={location.pathname === '/Settings/OrderAPI' ? 'text' : 'subdued'}
                                    >
                                        {t("settings.order_api.title")}
                                    </Text>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Usage Overview Settings */}
                <div
                    onClick={() => navigate('/Settings/usageoverview')}
                    style={{
                        padding: '8px 16px',
                        cursor: 'pointer',
                        backgroundColor: location.pathname === '/Settings/usageoverview' ? '#f3f4f6' : 'transparent',
                        borderLeft: location.pathname === '/Settings/usageoverview' ? '4px solid #1a1a1a' : '4px solid transparent',
                        borderRadius: '0 4px 4px 0'
                    }}
                >
                    <table style={{ borderCollapse: 'collapse', borderSpacing: 0, width: '100%' }}>
                        <tbody>
                            <tr>
                                <td style={{ verticalAlign: 'middle', paddingRight: '10px', width: '20px' }}>
                                    <Icon source={ChartLineIcon} />
                                </td>
                                <td style={{ verticalAlign: 'middle', textAlign: 'left' }}>
                                    <Text
                                        fontWeight={location.pathname === '/Settings/usageoverview' ? 'bold' : 'regular'}
                                        tone={location.pathname === '/Settings/usageoverview' ? 'text' : 'subdued'}
                                    >
                                        {t("settings.usage_overview.title")}
                                    </Text>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </BlockStack>
        </div>
    );
};

export default SettingSideBar;
