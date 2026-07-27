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
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useAppBridge } from "@shopify/app-bridge-react";
import {ProductPicker} from "./index"
import React, { useCallback, useEffect, useState,useContext } from "react"
import { AppContext } from "../components/providers/AppProvider.jsx";



const EditDigitalLotteryModal = (props) => {

    const { t } = useTranslation();
    const { primaryLocale } = useContext(AppContext);
    const shopify = useAppBridge();
    //   const [browserLanguage, setBrowserLanguage] = useState(primaryLocale)
    const [browserLanguage, setBrowserLanguage] = useState(primaryLocale);

	const [lotteryType, setLotteryType] = useState(props.digitalLottery.lottery_type);
    const [startNumber, setStartNumber] = useState(props.digitalLottery.start_number)
    const [product, setProduct] = useState(props.digitalLottery.product)
    const [endNumber, setEndNumber] = useState(props.digitalLottery.end_number)
    const [digitalLottery, setDigitalLottery] = useState(props.digitalLottery)
    const [isSaving, setIsSaving] = useState(false)

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
            formData.append("product", JSON.stringify(product))
            if(lotteryType == 2) {
            	formData.append('start_number', startNumber);
            	formData.append('end_number', endNumber)
            }


            const response = await fetch('/api/update-digital-lottery/'+digitalLottery.id, {
                method: 'POST',

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
                    shopify.toast.show(t("digtal_lottery.digital_lottery_updated_successfully"))
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
            console.log("ERROR")
            console.log(error)
            // }
        }

        setIsSaving(false)
    }, [lotteryType, startNumber, endNumber])



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
                    content: t("digtal_lottery.update"),
                    onAction: handleSave
                    // disabled: !canSave
                }}
            >

                <Modal.Section>
                    <ProductPicker
                        isEdit={true}
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


export default EditDigitalLotteryModal
