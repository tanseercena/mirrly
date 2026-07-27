import {
    BlockStack,
    Button,
    Card,
    InlineStack,
    Layout,
    List,
    Page,
    SkeletonBodyText,
    SkeletonPage,
    Text,
    } from '@shopify/polaris'
import { useAppBridge } from '@shopify/app-bridge-react'
import { useNavigate } from 'react-router-dom'
import React, { useCallback, useState, useEffect } from 'react'

export default function Plans() {
    const shopify = useAppBridge()
    const navigate = useNavigate()
    const [isLoadingData, setIsLoadingData] = useState(true)

    useEffect(() => {
        shopify.loading(isLoadingData);
    }, [isLoadingData, shopify]);
    const [plans, setPlans] = useState([])
    const [subscription, setSubscription] = useState([])
    const [freePlan, setFreePlan] = useState({});

    const toggleToast = useCallback(
        () => setShowToast((showToast) => !showToast),
        []
    )

    const downgradeToFree = async () => {
        if (!subscription) {
            navigate('/')
        } else {
            setIsLoadingData(true)

            const response = await fetch(`/api/billing/cancel`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
            // console.log(response)
            if (response.ok) {
                setIsLoadingData(false)
                shopify.toast.show('subscription canceled')
                refetchSubscription()
            } else {
                setIsLoadingData(false)
                shopify.toast.show('An error has occurred', { isError: true, duration: 9999999 })
                refetchSubscription()
            }
        }
    }

    const subscribeToPlan = async (id) => {
        setIsLoadingData(true)
        const response = await fetch(`/api/billing`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
            }),
        })
        // console.log(response);
        if (response.ok) {
            // refetchConnections();
            setIsLoadingData(false)
            // setToastMessage("Already on plan");
            // setIsErrorToast(false);
            // setShowToast(true);
        } else {
            // setToastMessage("An error has occured");
            // setIsErrorToast(true);
            // setShowToast(true);
            setIsLoadingData(false)
        }
    }

    const {
        plansResponse,
        refetch: refetchPlans,
        isLoading: isLoadingPlans,
        isRefetching: isRefetchingPlans,
    } = useAppQuery({
        url: `/api/plans`,
        reactQueryOptions: {
            onSuccess: (response) => {
                setPlans(response.data)
                setIsLoadingData(false)
                setFreePlan(response.data.find((plan) => plan.name == 'free'))
                // console.log(response.data);
            },
        },
    })

    const {
        subscriptionResponse,
        refetch: refetchSubscription,
        isLoading: isLoadingSubscription,
        isRefetching: isRefetchingSubscription,
    } = useAppQuery({
        url: `/api/subscription`,
        reactQueryOptions: {
            onSuccess: (response) => {
                setSubscription(response.data.subscription)
                setIsLoadingData(false)
                // console.log(response.data);
            },
        },
    })

    const loadingMarkup = isLoadingData && (
        <SkeletonPage title="Pricing" primaryAction>
            <Layout>
                <Layout.Section>
                    <Card>
                        <BlockStack gap="300">
                            <Text variant="headingMd" as="h2">
                                Pricing
                            </Text>
                            <SkeletonBodyText />
                            <SkeletonBodyText />
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>
        </SkeletonPage>
    )

    
    return <>
        {loadingMarkup}
        {toastMarkup}
        {!isLoadingData && (
            <Page
                title="Pricing"
                // primaryAction={{
                //     content: "Primary action",
                //     onAction: () => console.log("Primary action"),
                // }}
                // secondaryActions={[
                //     {
                //         content: "Secondary action",
                //         onAction: () => console.log("Secondary action"),
                //     },
                // ]}
                backAction={{ content: 'Account', url: '/account' }}
                fullWidth
            >
                <Layout>
                    <Layout.Section>
                                <Text variant="heading2xl" as={'h2'} alignment={'center'}>
                                    Choose a plan that is right for you.
                                </Text>
                                <Text
                                    variant="headingMd"
                                    color="subdued"
                                    as={'p'}
                                    alignment={'center'}
                                ><i>
                                        All paid plans come with a 7-day
                                        free trial.
                                    </i>
                                </Text>
                    </Layout.Section>

                    <Layout.Section>
                        <InlineStack align={'center'} gap={'400'}>
                            {/*<Card>*/}
                            {/*    <LegacyStack*/}
                            {/*        vertical*/}
                            {/*        alignment="center"*/}
                            {/*    >*/}
                            {/*        <Text>*/}
                            {/*            Or get started with our FREE*/}
                            {/*            plan*/}
                            {/*        </Text>*/}
                            {/*        <Text variant="headingXl">*/}
                            {/*            Free plan*/}
                            {/*        </Text>*/}
                            {/*        <List type="bullet">*/}
                            {/*            {plans.length > 0 &&*/}
                            {/*                plans*/}
                            {/*                    .find(*/}
                            {/*                        (plan) =>*/}
                            {/*                            plan.name ==*/}
                            {/*                            'free'*/}
                            {/*                    )*/}
                            {/*                    .features.map(*/}
                            {/*                    (feature) => (*/}
                            {/*                        <List.Item*/}
                            {/*                            key={*/}
                            {/*                                feature*/}
                            {/*                            }*/}
                            {/*                        >*/}
                            {/*                            {feature}*/}
                            {/*                        </List.Item>*/}
                            {/*                    )*/}
                            {/*                )}*/}
                            {/*        </List>*/}
                            {/*        <Button*/}
                            {/*            onClick={() =>*/}
                            {/*                downgradeToFree()*/}
                            {/*            }*/}
                            {/*        >*/}
                            {/*            {subscription*/}
                            {/*                ? 'Cancel Subscription & Downgrade to Free Plan'*/}
                            {/*                : 'Continue With Free Plan'}*/}
                            {/*        </Button>*/}
                            {/*        {subscription && (*/}
                            {/*            <Text>*/}
                            {/*                <strong*/}
                            {/*                    style={{*/}
                            {/*                        fontStyle: 'italic',*/}
                            {/*                    }}*/}
                            {/*                >*/}
                            {/*                    This will cancel your*/}
                            {/*                    active subscription and*/}
                            {/*                    move you to the free*/}
                            {/*                    plan.*/}
                            {/*                </strong>*/}
                            {/*            </Text>*/}
                            {/*        )}*/}
                            {/*    </LegacyStack>*/}
                            {/*</Card>*/}
                            {plans.map((plan) => (
                                <Card>
                                    <BlockStack gap={'300'}>
                                        <Text variant="headingMd" as={'h3'} alignment={'center'}>
                                            {plan.name
                                                .slice(0, 1)
                                                .toUpperCase() +
                                                plan.name.slice(
                                                    1
                                                )}{' '}
                                            plan
                                        </Text>
                                        <Text variant="headingXl" as={'p'} alignment={'center'}>
                                            ${plan.monthly_charge}/month
                                        </Text>
                                        <List type="bullet">
                                            {plan.features.map(
                                                (feature) => (
                                                    <List.Item
                                                        key={
                                                            feature
                                                        }
                                                    >
                                                        {feature}
                                                    </List.Item>
                                                )
                                            )}
                                        </List>
                                        <Button
                                            variant="primary"
                                            disabled={
                                                subscription?.plan_id ===
                                                plan.id
                                            }
                                            onClick={() =>
                                                plan.name === 'free' ? downgradeToFree() : subscribeToPlan(
                                                    plan.id
                                                )
                                            }
                                        >
                                            {subscription &&
                                                subscription.plan_id ===
                                                plan.id
                                                ? 'Current Plan'
                                                : 'Choose Plan'}

                                        </Button>
                                        {subscription && plan.name === 'free' && (
                                            <Text as={'p'} tone={'caution'}>*This will cancel your paid
                                                subscription<br />
                                                and move you to the free plan</Text>)}
                                    </BlockStack>
                                </Card>

                            ))}
                        </InlineStack>
                    </Layout.Section>
                </Layout>
            </Page>
        )}
    </>
}