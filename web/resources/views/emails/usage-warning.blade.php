<x-mail::message>
Dear {{ $store->owner }},

We hope you're enjoying using {{ config('app.name') }}.

Your {{ config('app.name') }} {{ $details['type'] }} usage has reached {{ $details['level'] }}% of your monthly limit. To avoid pausing your active campaigns, we suggest upgrading your account.

By upgrading, you'll not only avoid any campaign pauses, but you'll also unlock an array of additional features that can help you take your business to the next level.

<x-mail::button :url="''">
Upgrade Your Account Now
</x-mail::button>

Questions? Our support team is always here to help.

Thank you for choosing {{ config('app.name') }}.

</x-mail::message>
