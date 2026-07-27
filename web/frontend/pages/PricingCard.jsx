import React, { useState, useEffect } from 'react';
import { BlockStack, Card, Text, InlineStack, Box, Button, Badge, ButtonGroup, List } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { t } from 'i18next';

const PricingCard = ({ id, title, description, price, features, featuredText, button, frequency, subscription, isBillingInProgress, installationDate, planSelected }) => {
    const shopify = useAppBridge();
    const isFreePlan = price === "$0";
    const [plans, setPlans] = useState([]);
    const { t } = useTranslation()


    // Function to convert feature text to translation key
    const getFeatureKey = (feature) => {
        // Convert to lowercase and replace special characters/spaces with underscores
        let key = feature.toLowerCase()
            .replace(/[^\w\s]/g, '') // Remove special characters except spaces
            .replace(/\s+/g, '_') // Replace spaces with underscores
            .replace(/_/g, '_'); // Ensure consistent underscores

        // Handle special cases
        if (key.includes('orders')) {
            const number = feature.match(/(\d+)/)?.[1];
            if (number) {
                if (feature.toLowerCase().includes('unlimited')) {
                    return 'unlimited_orders';
                }
                // Check if it's the special case "5000 Orders*" without "per month"
                if (number === '5000' && !feature.toLowerCase().includes('per month')) {
                    return `${number}_orders`;
                }
                return `${number}_orders_per_month`;
            }
        }

        if (key.includes('file storage')) {
            const size = feature.match(/(\d+gb)/i)?.[1]?.toLowerCase();
            if (size) {
                if (feature.toLowerCase().includes('unlimited')) {
                    return 'unlimited_file_storage';
                }
                return `${size}_file_storage`;
            }
        }

        // Special case: Check for "2GB per file (can be increased up to 10 GB on request)" first
        if (feature.toLowerCase().includes('2gb') &&
            feature.toLowerCase().includes('per file') &&
            (feature.toLowerCase().includes('request') ||
             feature.toLowerCase().includes('increased') ||
             feature.toLowerCase().includes('up to'))) {
            return '2gb_per_file_with_increase';
        }

        if (key.includes('per file')) {
            const size = feature.match(/(\d+)\s*(mb|gb)/i)?.[1];
            const unit = feature.match(/(mb|gb)/i)?.[1]?.toLowerCase();
            if (size && unit) {
                return `${size}${unit}_per_file`;
            }
        }

        if (key.includes('files per product')) {
            const number = feature.match(/(\d+)/)?.[1];
            if (number) {
                return `${number}_files_per_product`;
            }
        }

        if (key.includes('digital products')) {
            const number = feature.match(/(\d+)/)?.[1];
            if (number) {
                if (feature.toLowerCase().includes('unlimited')) {
                    return 'unlimited_digital_products';
                }
                return `${number}_digital_products`;
            }
        }

        if (key.includes('digital lottery')) {
            const number = feature.match(/(\d+)/)?.[1];
            if (number) {
                if (feature.toLowerCase().includes('lotteries')) {
                    return 'unlimited_digital_lotteries';
                }
                return `${number}_digital_lottery`;
            }
        }

        // Handle simple features
        const simpleFeatures = {
            'file delivery': 'file_delivery',
            'license keys': 'license_keys',
            'license tracking': 'license_tracking',
            'custom links': 'custom_links',
            'auto fulfill orders': 'auto_fulfill_orders',
            'auto fulfill': 'auto_fulfill_orders',
            'auto fulfil orders': 'auto_fulfill_orders',
            'sample files on product': 'sample_files_on_product',
            'sample files': 'sample_files_on_product',
            'email template editing': 'email_template_editing',
            'email template': 'email_template_editing'
        };

        // Check for exact matches
        for (const [pattern, translationKey] of Object.entries(simpleFeatures)) {
            if (feature.toLowerCase().includes(pattern)) {
                return translationKey;
            }
        }

        return key;
    };

    // Function to translate a feature
    const translateFeature = (feature) => {
        const key = getFeatureKey(feature);
        const translated = t(`features.${key}`);


        // Return translated text if it exists (not the key itself), otherwise return original
        return translated !== `features.${key}` ? translated : feature;
    };

    const discountPercentage = 50;
    const originalPrice = isFreePlan ? 0 : parseFloat(price.slice(1));
    const discountedPrice = isFreePlan ? 0 : (originalPrice * (1 - discountPercentage / 100)).toFixed(2);

    const isDateValid = installationDate && !isNaN(new Date(installationDate).getTime());
    const showDiscount = !isFreePlan && frequency=='year' && new Date() < new Date('2025-05-15');

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await fetch('/api/plans');
            if (!response.ok) {
                throw new Error(`${t("plans.failed_to_fetch_plans")}`);
            }
            const data = await response.json();
            setPlans(data.data);
        } catch (error) {
            console.error('Error fetching plans:', error);
            shopify.toast.show(t("plans.failed_to_fetch_plans"), { isError: true, duration: 9999999 });
        }
    };

    let isCurrentPlan = false;

    // if (isFreePlan) {
    //     isCurrentPlan = subscription?.plan_id === 1 || !subscription;
    // } else {
    //     isCurrentPlan = subscription && subscription.plan_id === id &&
    //         ((frequency === 'month' && subscription.interval === 'monthly') ||
    //             (frequency === 'year' && subscription.interval === 'yearly'));
    // }

    isCurrentPlan = subscription && subscription.plan_id === id &&
        ((frequency === 'month' && subscription.interval === 'monthly') ||
            (frequency === 'year' && subscription.interval === 'yearly'));

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const findPlanById = (planId) => {
        return plans.find(plan => plan.id === planId);
    };

    const calculateSavedPrice = () => {
        const cutoffDate = new Date('2025-05-15');

        if (frequency === "year" && !isFreePlan) {
            const plan = findPlanById(id);
            if (plan) {
                const monthlyPrice = parseFloat(plan.monthly_charge);
                const yearlyPrice = parseFloat(plan.yearly_charge);
                //const savings = yearlyPrice - (monthlyPrice * 12);

                if (new Date() <= cutoffDate) {
                    const savings = yearlyPrice * (50/100); // 50 % on yearly for first discount offer
                    const savingsAmount = Math.abs(savings).toFixed(2);
                    //const discountedSavings = (savingsAmount * 0.7).toFixed(2);
                    return `$${savingsAmount}`;
                } else {
                    const savings = yearlyPrice * (20/100); // 20 % on yearly
                    const savingsAmount = Math.abs(savings).toFixed(2);
                    return `$${savingsAmount}`;
                }
            }
        }

        if(frequency === "month" && !isFreePlan) {
            const plan = findPlanById(id);
            if (plan) {
                const monthlyPrice = parseFloat(plan.monthly_charge);

                if (new Date(installationDate) <= cutoffDate) {
                    const savings = monthlyPrice * (30/100); // 230 % on monthly for first discount offer
                    const savingsAmount = Math.abs(savings).toFixed(2);
                    //const discountedSavings = (savingsAmount * 0.7).toFixed(2);
                    return `$${savingsAmount}`;
                } else {
                    const savings = monthlyPrice * (20/100); // 20 % on yearly
                    const savingsAmount = Math.abs(savings).toFixed(2);
                    return `$${savingsAmount}`;
                }
            }
        }

        return null;
    };

    return (
        <div
            style={{
                width: "18rem",
                boxShadow: featuredText ? "0px 0px 15px 4px #CDFEE1" : "",
                borderRadius: ".75rem",
                position: "relative",
                zIndex: "0",
            }}
        >
            {featuredText ? (
                <div style={{ position: "absolute", top: "-15px", right: "6px", zIndex: "100" }}>
                    <Badge size="large" tone="success">
                        {featuredText}
                    </Badge>
                </div>
            ) : null}
            <Card>
                <BlockStack gap="400">
                    <BlockStack gap="200" align="start">
                        <Text as="h3" variant="headingLg">
                            {capitalizeFirstLetter(title)}
                        </Text>
                        {description ? (
                            <Text as="p" variant="bodySm" tone="subdued">
                                {description}
                            </Text>
                        ) : null}
                    </BlockStack>

                    <BlockStack>
                        <InlineStack blockAlign="end" gap="100" align="center">
                            {showDiscount}
                            {showDiscount ? (
                                <>
                                    <div style={{ textDecoration: 'line-through' }}>
                                        <Text variant="headingXl" as="h6">{t("plans.$")}{originalPrice.toFixed(2)}</Text>
                                    </div>
                                    <Text as="h5" variant="heading2xl">{t("plans./_$")}{discountedPrice}</Text>
                                </>
                            ) : (
                                <Text as="h2" variant="heading2xl">{price}</Text>
                            )}
                            <Box paddingBlockEnd="200">
                                <Text variant="bodySm" as="p">{t("plans./")} {frequency}</Text>
                            </Box>
                        </InlineStack>
                        {frequency === "year" && !isFreePlan && (
                            <InlineStack align="center">
                                <Box paddingVertical="base">
                                    <Text variant="bodySm" as="p">{t("plans.you_save")} {calculateSavedPrice()}</Text>
                                </Box>
                            </InlineStack>
                        )}
                        {frequency === "month" && !isFreePlan && (
                            <></>
                            // <InlineStack align="center">
                            //     <Box paddingVertical="base">
                            //         <Text variant="bodySm" as="p">💵 You save {calculateSavedPrice()}</Text>
                            //     </Box>
                            // </InlineStack>
                        )}
                    </BlockStack>

                    <BlockStack gap="100">
                        <List type="bullet">
                            {features?.map((feature, id) => (
                                <List.Item key={id}>
                                    <Text tone="subdued" as="p" variant="bodyMd">{translateFeature(feature)}</Text>
                                </List.Item>
                            ))}
                        </List>
                    </BlockStack>

                    <Box paddingBlockStart="200" paddingBlockEnd="200">
                        <ButtonGroup fullWidth>
                            <Button
                                {...button.props}
                                disabled={(isCurrentPlan || isBillingInProgress) && !(isFreePlan && subscription && !subscription.plan_selected)}
                            >
                                {isBillingInProgress
                                    ? t("plans.processing")
                                    : isFreePlan && subscription && !subscription.plan_selected
                                        ? t("plans.approve_charge")
                                        : isCurrentPlan
                                            ? t("plans.current_plan")
                                            : button.content}
                            </Button>
                        </ButtonGroup>
                        {isFreePlan && subscription && !subscription.plan_selected && (
                            <div style={{marginTop: "5px"}}>
                                <Text tone="subdued" as="p" variant="bodyMd"><strong>{t("plans.note")}</strong> {t("plans.approve_charge_note_desc")}</Text>
                            </div>
                        )}
                        {title == 'unlimited' && (
                            <div style={{marginTop: "5px"}}>
                                <Text tone="subdued" as="p" variant="bodyMd"><strong>{t("plans.*")}</strong> {t("plans.*_desc")}</Text>
                            </div>
                        )}
                    </Box>
                </BlockStack>
            </Card>
        </div>
    );
};

export default PricingCard;
