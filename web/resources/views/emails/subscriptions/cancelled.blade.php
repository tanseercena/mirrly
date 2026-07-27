<x-mail::message>
# Subscription cancelled for {{ config('app.name') }} App

Sadly {{ config('app.name') }} has lost a paid subscriber.

<x-mail::panel>
<ul>
    <li><strong>Store name: </strong>{{ $store->name }}</li>
    <li><strong>Store Url: </strong><a href="http://{{ $store->domain }}">{{ $store->domain }}</a></li>
    <li><strong>Shopify Plan: </strong>{{ $store->shopify_plan }}</li>
    <li><strong>Plan Name:</strong>{{ $plan->name }}</li>
    <li><strong>Interval: </strong>{{ $store->intended_plan_interval }}</li>
    <li><strong>Amount: </strong>${{ $store->intended_plan_interval == 'monthly' ? $plan->monthly_charge : $plan->yearly_charge }}</li>
</ul>
</x-mail::panel>

Thanks,<br>
    {{ config('app.name') }} Team
</x-mail::message>
