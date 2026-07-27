import { Banner, Text } from '@shopify/polaris'
import { useContext } from 'react'
import { AppContext } from './providers/AppProvider'

export function UpgradeBanner () {
    const { showUpgradeBanner } = useContext(AppContext)

    return (
        <>
            {showUpgradeBanner && (
                <Banner
                    title="You're close to your usage limits!"
                    action={{ content: 'View plans & pricing', url: '/plans' }}
                    tone="critical"
                >
                    <Text as={'p'}>
                        Upgrade now to continue enjoying our app's powerful
                        features without any interruptions. Don't pause, amplify
                        your growth! Your usage resets by month end.
                    </Text>
                </Banner>
            )}
        </>
    )
}
