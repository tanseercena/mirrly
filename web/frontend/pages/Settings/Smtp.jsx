import SettingSideBar from "../../components/SettingSideBar";

import {
    BlockStack,
    Button,
    Card,
    InlineStack,
    FormLayout,
    Layout,
    Page,
    SkeletonBodyText,
    SkeletonPage,
    Text,
    TextField,
    Checkbox,
    Modal,
    Tabs,
    LegacyCard,
        Banner,
    List,
    Tooltip,
    DropZone,
} from "@shopify/polaris";
import { SendIcon } from "@shopify/polaris-icons";
import { useState, useCallback } from "react";
import { Badge } from "@shopify/polaris";
import { Knob } from "../../components/knob/Knob";

const Smtp = () => {
    const [selected, setSelected] = useState(false);

    const [serverName, setServerName] = useState("");
    const [port, setPort] = useState("");

    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const [email, setEmail] = useState("");

    const [tlsChecked, setTlsChecked] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    return (
        <div>
            <Page title="Settings">
                <Layout>
                    <Layout.Section variant="oneThird">
                        <Card>
                            <SettingSideBar />
                        </Card>
                    </Layout.Section>
                    <Layout.Section>
                        <Card title="Tags" sectioned>
                            <Page
                                title="Smtp Setup"
                                subtitle="Customize email notifications for digital product orders: Enable/disable email sending and personalize subject and content."
                            >
                                <BlockStack gap={300}>
                                    <BlockStack>
                                        <InlineStack align="space-between">
                                            <InlineStack
                                                align="start"
                                                gap="200"
                                                blockAlign="center"
                                            >
                                                <Text as="p" variant="bodyMd">
                                                    Use your own SMTP server
                                                    (optional)
                                                </Text>
                                                <Badge
                                                    tone={
                                                        selected
                                                            ? "success"
                                                            : "attention"
                                                    }
                                                >
                                                    {selected ? "On" : "OF"}
                                                </Badge>
                                            </InlineStack>
                                            <Knob
                                                selected={selected}
                                                // ariaLabel='Example knob'
                                                onClick={() =>
                                                    setSelected((prev) => !prev)
                                                }
                                            />
                                        </InlineStack>
                                    </BlockStack>
                                    <BlockStack>
                                        <List type="bullet">
                                            <List.Item>
                                                Use your own SMTP server to
                                                avoid delayed email delivery at
                                                peak times or bursts of email
                                                volume.
                                            </List.Item>
                                            <List.Item>
                                                Our app will send email through
                                                your own SMTP server
                                            </List.Item>
                                            <List.Item>
                                                We can't track email delivery
                                                status events when you use
                                                custom SMTP
                                            </List.Item>
                                        </List>
                                    </BlockStack>

                                    <BlockStack gap={300}>
                                        <TextField
                                            label="Server name"
                                            value={serverName}
                                            onChange={(value) => {
                                                setServerName(value);
                                            }}
                                            autoComplete="off"
                                        />
                                        <TextField
                                            label="Port"
                                            placeholder="465,587,..."
                                            value={port}
                                            onChange={(value) => {
                                                setPort(value);
                                            }}
                                            autoComplete="off"
                                        />
                                    </BlockStack>

                                    <BlockStack>
                                        <Checkbox
                                            label="TLS secure"
                                            checked={tlsChecked}
                                            onChange={(value) => {
                                                setTlsChecked(value);
                                            }}
                                        />
                                    </BlockStack>

                                    <BlockStack gap={300}>
                                        <Checkbox
                                            label="Require authentication"
                                            checked={authChecked}
                                            onChange={(value) => {
                                                setAuthChecked(value);
                                            }}
                                        />
                                        {authChecked == true && (
                                            <BlockStack gap={300}>
                                                <TextField
                                                    label="Username"
                                                    value={username}
                                                    onChange={(value) => {
                                                        setUserName(value);
                                                    }}
                                                    autoComplete="off"
                                                />
                                                <TextField
                                                    label="Password"
                                                    type="password"
                                                    value={password}
                                                    onChange={(value) => {
                                                        setPassword(value);
                                                    }}
                                                    autoComplete="off"
                                                />
                                            </BlockStack>
                                        )}
                                    </BlockStack>

                                    <BlockStack gap={300}>
                                        <Text variant="headingMd" as="h6">
                                            Send test email
                                        </Text>

                                        <BlockStack gap={100}>

                                        <Text variant="bodyMd" as="p">
                                            Receiver
                                        </Text>
                                        <InlineStack gap={100}>
                                            <div style={{ flex: 1 }}>
                                                <TextField
                                                    
                                                    value={email}
                                                    onChange={(value) => {
                                                        setEmail(value);
                                                    }}
                                                    autoComplete="off"
                                                />
                                            </div>
                                            <div>
                                                <Button size="large" icon={SendIcon}>
                                                    Send
                                                </Button>
                                            </div>
                                        </InlineStack>
                                        </BlockStack>

                                    </BlockStack>
                                </BlockStack>
                            </Page>
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        </div>
    );
};

export default Smtp;
