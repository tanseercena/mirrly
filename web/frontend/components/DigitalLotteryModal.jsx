import prettyBytes from "pretty-bytes"

import {
    Button,
    DropZone,
    InlineStack,
    Icon,
    Modal,
    Text,
    BlockStack, Checkbox,
    RadioButton,
    TextField
} from "@shopify/polaris"
import {ProductPicker} from "./index"
import React, { useCallback, useEffect, useState,useContext } from "react"
import { useAppBridge } from "@shopify/app-bridge-react";
import { AppContext } from "../components/providers/AppProvider.jsx";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const DigitalLotteryModal = (props) => {
    const shopify = useAppBridge();


    const { t } = useTranslation();
    const { primaryLocale } = useContext(AppContext);
    //   const [browserLanguage, setBrowserLanguage] = useState(primaryLocale)
    const [browserLanguage, setBrowserLanguage] = useState(primaryLocale);


    // File schema: { name: string, size: number }
    const [lotteryType, setLotteryType] = useState(1);
    const [startNumber, setStartNumber] = useState(1)
    const [endNumber, setEndNumber] = useState(20)
    const [isSaving, setIsSaving] = useState(false)
    const [product, setProduct] = useState(null)
    const [autoFulfill, setAutoFulfill] = useState(false);

    const canSave = !isSaving && product
 //    const handleChange = useCallback(
	//     (_, newValue) => setLotteryType(newValue),
	//     [],
	// );


    const handleStartNumber = useCallback((value) => {
        setStartNumber(value);
    }, [startNumber]);

    const handleEndNumber = useCallback((value) => {
        setEndNumber(value);
    }, [startNumber]);


     const handleChange = useCallback(
        (newValue, id) => {
          if (id === 'sequential') {
            setLotteryType(1);
          } else if (id === 'range') {
            setLotteryType(2);
          }
        },
        [],
      );


    const handleSave = useCallback(async () => {

        setIsSaving(true)

        try {

            var formData = new FormData();

            // formData.append('files', validFiles);
            formData.append("lottery_type", JSON.stringify(lotteryType));
            formData.append("product", JSON.stringify(product));
            console.log(product)
            if(lotteryType == 2) {
            	formData.append('start_number', startNumber);
            	formData.append('end_number', endNumber)
            }


            const response = await fetch('/api/save-digital-lottery', {
                method: 'POST',
                // headers: {
                //     Accept: 'application/json',
                //     'Content-Type': 'application/json',
                // },
                // body: JSON.stringify({
                //     product: product,
                //     files: validFiles
                // }),
                body: formData
            })
            console.log(response);
            if (response.ok) {
                setIsSaving(false)
                const data = await response.json();
                if (data.error) {
                    if (data.type === 'exists') {
                        shopify.toast.show(t("digtal_lottery.digital_lottery_already_exists"), { isError: true, duration: 9999999 })
                    } else {
                        shopify.toast.show(t("digtal_lottery.something_wrong_happened_please_try_later"), { isError: true, duration: 9999999 })
                    }
                } else {
                    setIsSaving(false)
                    shopify.toast.show(t("digtal_lottery.digital_lottery_added_successfully"))
                    props.onClose()
                }

            } else {
                shopify.toast.show(t("digtal_lottery.something_wrong_happened_please_try_later"), { isError: true, duration: 9999999 })
            }
        } catch (error) {
            // if (error instanceof InvalidRecordError) {
            //     shopify.toast.show("Digital product already exists", { isError: true, duration: 9999999 })
            // } else {
            shopify.toast.show(t("digtal_lottery.something_wrong_happened_please_try_later"), { isError: true, duration: 9999999 })
            // }
        }

        setIsSaving(false)
    }, [lotteryType, startNumber, endNumber, product])


    const handleProductSelection = useCallback(product => {
        setProduct(product)
    }, [])


    return (
        <>
            <Modal
                open={props.isActive}
                onClose={props.onClose}
                title={isSaving ? t("digtal_lottery.please_wait_while_uploading...") : t("digtal_lottery.create_a_new_digital_lottery")}
                loading={isSaving}
                primaryAction={{
                    content: t("digtal_lottery.save"),
                    onAction: handleSave,
                    disabled: !canSave
                }}
            >

                <Modal.Section>
                    <ProductPicker
                        isEdit={false}
                        product={product}
                        onProductSelection={handleProductSelection}
                        onReset={() => handleProductSelection(null)}
                    />
                </Modal.Section>


                <Modal.Section>
                    <BlockStack gap="400">
                        <InlineStack col={2}>
                        	<RadioButton
						        label={t("digtal_lottery.sequential_lottery_number")}
						        helpText={t("digtal_lottery.customers_will_only_be_able_to_check_out_as_guests.")}
						        checked={lotteryType === 1}
						        id="sequential"
						        name="lottery"
						        onChange={(checked) => {handleChange(checked, 'sequential')}}
						      />
						      <RadioButton
						        label={t("digtal_lottery.range_lottery_number")}
						        helpText={t("digtal_lottery.generate_a_number_between_the_given_range.")}
						        id="range"
						        name="lottery"
						        checked={lotteryType === 2}
						        onChange={(checked) => {handleChange(checked, 'range')}}
						      />
                        </InlineStack>

                        {
                            lotteryType == 2 ?
                            <BlockStack gap="200">

                                <TextField
                                    label={t("digtal_lottery.start_number")}
                                    value={startNumber}
                                    onChange={handleStartNumber}
                                    type="number"
                                >

                                </TextField>

                                <TextField
                                    label={t("digtal_lottery.end_number")}
                                    value={endNumber}
                                    onChange={handleEndNumber}
                                    type="number"
                                >

                                </TextField>
                            </BlockStack>
                            : ''
                        }


                    </BlockStack>
                </Modal.Section>

            </Modal>
        </>
    )
}

export default DigitalLotteryModal
