import React, { useState, useEffect, useCallback } from 'react';
import {
    Card,
    Page,
    Tabs,
    Filters,
    Text,
    TextField,
    IndexTable,
} from '@shopify/polaris';

function Translations() {
    const [selected, setSelected] = useState(0);
    const [filterValue, setFilterValue] = useState("");
    const [translations, setTranslations] = useState([
        { id: '1020', resource: 'File', field: 'Filename', source_text: '2024-02-10_00-38', french: '' },
        { id: '1019', resource: 'File', field: 'Filename', source_text: 'FuBHGcQXgAAC1PL333', french: '' },
        { id: '1018', resource: 'Shopify order status page', field: 'Button', source_text: 'Access digital products', french: '' },
        { id: '1017', resource: 'Shopify order status page', field: 'Description', source_text: 'Your order contains digital products', french: '' },
        { id: '1016', resource: 'Shopify order status page', field: 'Digital products title', source_text: 'Digital roducts', frpench: '' },
        { id: '1015', resource: 'Downloads page', field: 'Visit link button text', source_text: 'Visit link', french: '' },
        { id: '1014', resource: 'Downloads page', field: 'Order title', source_text: 'ORDER {{order_name}}', french: '' },
    ]);

    const handleTabChange = useCallback((selectedTabIndex) => setSelected(selectedTabIndex), []);

    const handleFrenchChange = useCallback((id, value) => {
        setTranslations(prevTranslations => {
            return prevTranslations.map(translation => {
                if (translation.id === id) {
                    return { ...translation, french: value };
                }
                return translation;
            });
        });
    }, []);

    const tabs = [
        { id: 'content-1', content: 'All', panelID: 'content-1' },
        { id: 'content-2', content: 'Not translated', panelID: 'content-2' },
        { id: 'content-3', content: 'Translated', panelID: 'content-3' },
    ];

    const headings = [
        { title: 'Resource' },
        { title: 'Field' },
        { title: 'Source text' },
        { title: 'French' },
    ];

    const rowMarkup = translations.map(({ id, resource, field, source_text, french }) => {
        let placeholder = '';
        switch (id) {
            case '1018':
                placeholder = "Accéder aux produits numériques";
                break;
            case '1017':
                placeholder = "Votre commande contient des produits numériques. Accédez-y ci-dessous ou via l'e-mail que nous vous avons envoyé.";
                break;
            case '1016':
                placeholder = "Produits numériques";
                break;
            case '1015':
                placeholder = "Visitez le lien";
                break;
            case '1014':
                placeholder = "COMMANDE {{nom_de_la_commande }}";
                break;
            default:
                placeholder = "Enter French translation";
        }

        return (
            <IndexTable.Row id={id} key={id}>
                <IndexTable.Cell>{resource}</IndexTable.Cell>
                <IndexTable.Cell>{field}</IndexTable.Cell>
                <IndexTable.Cell>{source_text}</IndexTable.Cell>
                <IndexTable.Cell>
                    <TextField
                        label=""
                        value={french}
                        onChange={(value) => handleFrenchChange(id, value)}
                        autoComplete="off"
                        placeholder={placeholder}
                    />
                </IndexTable.Cell>
            </IndexTable.Row>
        );
    });

    return (
        <Page
            title="Translations"
            primaryAction={{ content: 'Save' }}
            secondaryActions={[
                {
                    content: 'French (FR)',
                    accessibilityLabel: 'Secondary action label',
                    onAction: () => alert('French action'),
                },
                {
                    content: 'All supported markets',
                    accessibilityLabel: 'All markets action label',
                    onAction: () => alert('All supported markets action'),
                }
            ]}
        >
            <Card sectioned>
                <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
                    {tabs[selected].content === 'All' ? (
                        <>
                            <div style={{ margin: "10px", padding: "10x" }}>
                                <TextField
                                    value={filterValue}
                                    onChange={(newValue) => setFilterValue(newValue)}
                                    autoComplete="off"
                                    placeholder="Filter translation"
                                />
                            </div>
                            <IndexTable
                                resourceName={{ singular: 'translation', plural: 'translations' }}
                                headings={headings}
                                itemCount={translations ? translations.length : 0}
                                selectedItemsCount={translations ? translations.length : 0}
                                onSelectionChange={() => { }}
                                selectable={false}
                            >
                                {rowMarkup}
                            </IndexTable>
                        </>
                    ) : tabs[selected].content === 'Not translated' ? (
                        <Text variant="bodyLg" as="p">Content for Not translated</Text>
                    ) : tabs[selected].content === 'Translated' ? (
                        <Text variant="bodyLg" as="p">Content for Translated</Text>
                    ) : (
                        <Text variant="bodyLg" as="p">This is the default tab content</Text>
                    )}
                </Tabs>
            </Card>
        </Page>
    );
}

export default Translations;
