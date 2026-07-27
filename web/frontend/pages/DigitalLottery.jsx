import {
    Card,
    Button,
    ButtonGroup,
    EmptyState,
    InlineStack,
    Layout,
    Page,
    ResourceItem,
    ResourceList,
    Text,
    Thumbnail,
    Icon,
    BlockStack,
        Modal,
    LegacyStack,
    Banner,
    InlineGrid,
    Link,
    Pagination,
    SkeletonBodyText,
    TextField,
    Select,
    Autocomplete
} from "@shopify/polaris"

import React, { useCallback, useEffect, useState,useContext } from "react"

import { useAppBridge } from "@shopify/app-bridge-react"
import { useNavigate } from "react-router-dom"
import DigitalLotteryModal from '../components/DigitalLotteryModal.jsx'
import { IntroVideoCard } from "../components"
import { AppContext } from "../components/providers/AppProvider.jsx";
import { EditIcon, DeleteIcon, PlusIcon } from '@shopify/polaris-icons';
import EditDigitalLotteryModal from '../components/EditDigitalLotteryModal'
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import LanguageSelector from '../components/LanguageSelector.jsx';
import { isCardDismissed, dismissCard } from "../utils/sessionStorage.js";
function DigitalLottery() {
    const shopify = useAppBridge();
    const navigate = useNavigate();
    const { store,refetchStore } = React.useContext(AppContext)
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)

    const [isDigitalModalActive, setIsDigitalModalActive] = useState(false)
    const [isEditDigitalModalActive, setIsEditDigitalModalActive] = useState(false)

    const [digitalLotteries, setDigitalLotteries] = useState([])
    const hasEmptyDigitalLotteries = !digitalLotteries.length
    const [digitalLottery, setDigitalLottery] = useState(null)
    const [digitalLotteriesLimit, setDigitalLotteriesLimit] = useState(0);
    const [isLimitExceededModalActive, setIsLimitExceededModalActive] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalLotteries, setTotalLotteries] = useState(0);
    const lotteriesPerPage = 10;
    const [isConfirmDeleteModalActive, setIsConfirmDeleteModalActive] = useState(false);
    const [lotteryToDelete, setLotteryToDelete] = useState(null);
    const [loading, setLoading] = useState(true)
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);
    const [showSetupGuide, setShowSetupGuide] = useState(!isCardDismissed('digital_lottery_setup_guide'));


    useEffect(() => {
    if (store.finish_onboarding === 0) {
        refetchStore();
    }
}, [refetchStore, store.finish_onboarding]);

    const [data, setData] = useState(null);
    const [isLoadingPlans, setIsLoadingPlans] = useState(false);
    const [isRefetchingDigitalProducts, setIsRefetchingDigitalProducts] = useState(false);

    const refetchDigitalLotteries = async () => {
        try {
            setIsLoadingPlans(true);
            setIsRefetchingDigitalProducts(true);
            const response = await fetch(`/api/digital-lotteries?page=${currentPage}&limit=${lotteriesPerPage}`);

            if (!response.ok) {
                throw new Error('Failed to fetch digital lotteries');
            }

            const result = await response.json();
            setData(result);
            setDigitalLotteries(result.data);
            setTotalLotteries(result.total);
            setIsLoadingData(false);
        } catch (error) {
            console.error('Failed to fetch digital lotteries:', error);
            setIsLoadingData(false);
        } finally {
            setIsLoadingPlans(false);
            setIsRefetchingDigitalProducts(false);
        }
    };

    useEffect(() => {
        setIsLoadingData(true);
        refetchDigitalLotteries();
    }, [currentPage]);



    const { t } = useTranslation();

    const handleDismissSetupGuide = useCallback(() => {
        setShowSetupGuide(false);
        dismissCard('digital_lottery_setup_guide');
    }, []);


    const handleInputChange = async (value) => {
        setInputValue(value);

        if (value.length > 2) {
            setLoading(true);

            try {
                const response = await fetch(`/api/search-product?search=${encodeURIComponent(value)}&page=1&limit=10`, {
                    method: 'GET',
                });

                const data = await response.json();
                if (response.ok) {
                    setOptions(data.data.map(item => ({
                        label: item.product.title,
                        value: item.product.title,
                    })));
                } else {
                    console.error('Error fetching search results');
                }
            } catch (error) {
                console.error('Error fetching search results:', error);
            } finally {
                setLoading(false);
            }
        } else {
            setOptions([]);
        }
    };

    const updateSelection = useCallback((selected) => {
        if (!selected || selected.length === 0) {
            return;
        }

        const selectedValue = selected[0];
        const matchedOption = options.find(option => option.label === selectedValue);

        if (matchedOption) {
            setSelectedOptions([selectedValue]);
            setInputValue(matchedOption.label);
            setOptions([matchedOption]);
        }
    }, [options]);

    const handlePaginationChange = async (newPage) => {
        setIsLoadingData(true);
        const response = await fetch(`/api/search-product?search=${inputValue}&page=${newPage}&limit=${lotteriesPerPage}`, {
            method: 'GET',
        });

        const data = await response.json();
        if (response.ok) {
            setDigitalLotteries(data.data);
            setTotalLotteries(data.total);
            setCurrentPage(data.current_page);
            setIsLoadingData(false);
        } else {
            console.error('Error fetching paginated results');
            setIsLoadingData(false);
        }
    };

    const openDigitalLotteryModal = useCallback(() => {
        setIsDigitalModalActive(true)
    }, [])

    const closeDigitalLotteryModal = useCallback(async () => {
        setIsDigitalModalActive(false)
        await refetchDigitalLotteries();
    }, [])


    const handleEditDigitalLottery = useCallback(async (digitalLottery) => {
        console.log("Edit: ");
        console.log(digitalLottery);
        setDigitalLottery(digitalLottery);
        setIsEditDigitalModalActive(true)
    }, []);

    const closeEditDigitalLotteryModal = useCallback(async () => {
        setIsEditDigitalModalActive(false)
        await refetchDigitalLotteries();
    }, [])

    const handleDeleteDigitalLottery = useCallback(async (digitalLottery) => {
        // try {
        //     await deleteDigitalProduct({ id: digitalProduct.id })
        //     refetch()
        // } catch (error) {
        //     console.log(error)
        // }
        setIsDeleting(true)

        const response = await fetch(`/api/delete-digital-lottery/${digitalLottery.id}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        })
        // console.log(response)
        if (response.ok) {
            setIsDeleting(false)
            shopify.toast.show(t("digtal_lottery.digital_lottery_deleted_successfully"))
            await refetchDigitalLotteries()

        } else {
            // Error
        }


    }, [])

    useEffect(() => {
        if (store) {
            const lotteriesLimit = store.plan.limits.digital_lotteries === 'unlimited' ? Infinity : Number(store.plan.limits.digital_lotteries);
            setDigitalLotteriesLimit(lotteriesLimit);

        }
    }, [store]);

    const handleCreateDigitalLottery = useCallback(() => {
        if (store.digital_lotteries_limit <= 0 && Number.isFinite(digitalLotteriesLimit)) {
            setIsLimitExceededModalActive(true);
        } else {
            openDigitalLotteryModal();
        }
    }, [digitalLotteries.length, digitalLotteriesLimit, openDigitalLotteryModal]);

    const closeLimitExceededModal = useCallback(() => {
        setIsLimitExceededModalActive(false);
    }, []);

    const handlePricing = () => navigate("/pricing");

    const emptStateMarkup = hasEmptyDigitalLotteries && (
        <EmptyState
            heading={t("digtal_lottery.create_a_digital_lottery_to_get_started")}
            action={{ content: t("digtal_lottery.create_digital_lottery"), icon: PlusIcon, onAction: handleCreateDigitalLottery }}
            image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
        >
            {t("digtal_lottery.create_your_first_digital_lottery_and_start_selling_it_right_away!")}
        </EmptyState>
    )

    const digitalLotteryModalMarkup = (isDigitalModalActive) && (
        <DigitalLotteryModal
            shopId={1}
            isActive={isDigitalModalActive}
            onClose={closeDigitalLotteryModal}
        />
    )

    const editDigitalLotteryModalMarkup = (isEditDigitalModalActive) && (
        <EditDigitalLotteryModal
            shopId={1}
            isActive={isEditDigitalModalActive}
            onClose={closeEditDigitalLotteryModal}
            digitalLottery={digitalLottery}
        />
    )

    const handleClearSearch = () => {
        setInputValue("");
        setSelectedOptions([]);
        setIsLoadingData(true);
        setCurrentPage(1);

        fetch(`/api/search-product?page=1&limit=${lotteriesPerPage}`, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((data) => {
                setDigitalLotteries(data.data);
                setTotalLotteries(data.total);
                setIsLoadingData(false);
            })
            .catch(() => {
                setIsLoadingData(false);
                console.error("Error fetching products");
            });
    };

    const handleSearch = async () => {
        setIsLoadingData(true);
        setCurrentPage(1);
        const response = await fetch(`/api/search-product?search=${inputValue}&page=1&limit=${lotteriesPerPage}`, {
            method: 'GET',
        });

        const data = await response.json();
        if (response.ok) {
            setDigitalLotteries(data.data);
            setTotalLotteries(data.total);
            setCurrentPage(data.current_page);
            setIsLoadingData(false);
        } else {
            console.error('Error fetching search results');
            setIsLoadingData(false);
        }
    };

    const textField = (
        <Autocomplete.TextField
            onChange={handleInputChange}
            value={inputValue}
            autoComplete="off"
            placeholder={t("digtal_lottery.search_by_product_name")}
            clearButton
            onClearButtonClick={handleClearSearch}
        />
    );

    return (
        <>
            {digitalLotteryModalMarkup}

            {editDigitalLotteryModalMarkup}
            <Page title={t("digtal_lottery.digital_lottery")}
                secondaryActions={
                   <LanguageSelector/>
                }
            >


                <div style={{ marginTop: "10px" }}></div>

                {showSetupGuide && (
                    <IntroVideoCard
                        video_link="https://www.loom.com/share/c4526be5bd3640348aa488db4811b0ba?sid=6d2560a7-6e68-40f4-b5f6-dc24effedeef"
                        title={t("digtal_lottery.digital_lottery_setup_guide")}
                        description={t("digtal_lottery.watch_this_video_guide_to_learn_how_to_set_up_your_digital_lotteries_whether_youre_creating_a_sequential_lottery_number_or_a_range_lottery_number_well_walk_you_through_the_steps_to_configure_and_manage_your_lotteries_effortlessly")}
                        onCancel={handleDismissSetupGuide}
                    />
                )}

                {isLoadingData && (
                    <Layout>
                        <Layout.Section>
                            <Card>
                                <BlockStack gap="300">
                                    <SkeletonBodyText />
                                </BlockStack>
                            </Card>
                        </Layout.Section>
                    </Layout>
                )}

                {!isLoadingData && (
                    <Layout>

                        <Layout.Section>
                            <Card>
                                <div style={{ 
                                    display: "flex", 
                                    gap: "8px",
                                    flexDirection: window.innerWidth <= 768 ? "column" : "row"
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <Autocomplete
                                            options={options}
                                            selected={selectedOptions}
                                            onSelect={updateSelection}
                                            textField={textField}
                                            loading={loading}
                                        />
                                    </div>
                                        <Button variant="primary" onClick={handleSearch} fullWidth={window.innerWidth <= 768}>
                                            {t("digtal_lottery.search")}
                                        </Button>
                                </div>
                                <ResourceList
                                    emptyState={emptStateMarkup}
                                    resourceName={{ singular: "digital lottery", plural: "digital lotteries" }}
                                    items={digitalLotteries}
                                    loading={false}
                                    showHeader
                                    alternateTool={<Button variant="primary" icon={PlusIcon} onClick={handleCreateDigitalLottery}>{t("digtal_lottery.create_digital_lottery")}</Button>}
                                    renderItem={(item) => {
                                        return (
                                            <ResourceItem id={item.id}>
                                                <DigitalLotteryItem
                                                    digitalLottery={item}
                                                    isDeleting={isDeleting}
                                                    onDelete={(digitalLottery) => {
                                                        setLotteryToDelete(digitalLottery);
                                                        setIsConfirmDeleteModalActive(true);
                                                    }}
                                                    onEdit={(digitalLottery) => handleEditDigitalLottery(digitalLottery)}
                                                    setLotteryToDelete={setLotteryToDelete}
                                                />
                                            </ResourceItem>
                                        )
                                    }}
                                >

                                </ResourceList>
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                    <Pagination
                                        hasPrevious={currentPage > 1}
                                        onPrevious={() => handlePaginationChange(currentPage - 1)}
                                        hasNext={digitalLotteries.length === lotteriesPerPage && totalLotteries > currentPage * lotteriesPerPage}
                                        onNext={() => handlePaginationChange(currentPage + 1)}
                                        labels={{ next: 'Next', previous: 'Previous' }}
                                        disabled={isLoadingData}
                                    />
                                </div>
                            </Card>

                            <Modal
                                open={isLimitExceededModalActive}
                                onClose={closeLimitExceededModal}
                                title="Limit Exceeded"
                                primaryAction={{
                                    content: 'Close',
                                    onAction: closeLimitExceededModal,
                                }}
                            >
                                <Modal.Section>
                                    <LegacyStack vertical>
                                        <LegacyStack.Item>
                                            <Banner tone="warning">
                                                <Text variant="bodyMd" as="p">
                                                   {t("digtal_lottery.you_have_reached_the_current_plans_limit_for_digital_lotteries_upgrade_to_a_higher_plan_to_add_more_digital_lotteries")}
                                                </Text>
                                                <div style={{ marginTop: "10px" }}></div>
                                                <Button variant="primary" onClick={handlePricing}>{t("digtal_lottery.upgrade_now")}</Button>
                                            </Banner>
                                        </LegacyStack.Item>
                                    </LegacyStack>
                                </Modal.Section>
                            </Modal>

                            <Modal
                                open={isConfirmDeleteModalActive}
                                onClose={() => setIsConfirmDeleteModalActive(false)}
                                title="Confirm Delete"
                                primaryAction={{
                                    destructive: true,
                                    content: t("digtal_lottery.delete"),
                                    onAction: async () => {
                                        if (lotteryToDelete) {
                                            await handleDeleteDigitalLottery(lotteryToDelete);
                                            setLotteryToDelete(null);
                                        }
                                        setIsConfirmDeleteModalActive(false);
                                    },
                                }}
                            >
                                <Modal.Section>
                                    <Text variant="bodyMd" as="p">
                                    {t("digtal_lottery.are_you_sure_you_want_to_delete_this_digital_lottery")}
                                    </Text>
                                </Modal.Section>
                            </Modal>

                        </Layout.Section>


                    </Layout>
                )}
                <div style={{ paddingBottom: "80px" }}></div>
            </Page>
        </>
    )

}

const DigitalLotteryItem = (props) => {
    const { digitalLottery, setLotteryToDelete, isDeleting } = props;
    const productImage = digitalLottery.product.images[0]?.originalSrc;

    const { t } = useTranslation();
    return (



        <InlineStack blockAlign="center" align="space-between">
            <InlineStack gap="400" blockAlign="center">
                <Thumbnail size="medium" source={productImage} />

                <BlockStack>
                    <Text variant="headingSm" as="h3" fontWeight="bold">
                        {digitalLottery.product.title}
                    </Text>

                    <Text variant="bodyMd" as="p" color="subdued">
                        Type: {digitalLottery.lottery_type == 1 ? 'Sequential' : 'Range'}
                    </Text>
                </BlockStack>


            </InlineStack>

            <ButtonGroup>
                <Button
                    icon={EditIcon}
                    variant="secondary"
                    disabled={props.isDeleting || digitalLottery.is_disabled === 1}
                    loading={props.isDeleting}
                    onClick={() => props.onEdit(digitalLottery)}
                >
                    {t("digtal_lottery.edit")}
                </Button>
                <Button
                    icon={DeleteIcon}
                    variant="primary" tone="critical"
                    disabled={props.isDeleting || digitalLottery.is_disabled === 1}
                    loading={isDeleting}
                    onClick={() => {
                        setLotteryToDelete(digitalLottery);
                        props.onDelete(digitalLottery);
                    }}
                >
                    {t("digtal_lottery.delete")}
                </Button>
            </ButtonGroup>
        </InlineStack>
    )
}


export default DigitalLottery
