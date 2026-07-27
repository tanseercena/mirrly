<x-mail::message>
# New Subscription for {{ config('app.name') }} App

Congrats {{ config('app.name') }} has a new paid subscription of ${{ $store->intended_plan_interval == 'monthly' ? $store->subscription->plan->monthly_charge : $store->subscription->plan->yearly_charge }}

<x-mail::panel>
<ul>
    <li><strong>Store name: </strong>{{ $store->name }}</li>
    <li><strong>Store Url: </strong><a href="http://{{ $store->domain }}">{{ $store->domain }}</a></li>
    <li><strong>Shopify Plan: </strong>{{ $store->shopify_plan }}</li>
    <li><strong>Plan Name: </strong>{{ ucfirst($store->subscription->plan->name) }} plan</li>
    <li><strong>Interval: </strong>{{ ucfirst($store->intended_plan_interval) }}</li>
    <li><strong>Amount:
        </strong>${{ $store->intended_plan_interval == 'monthly' ? $store->subscription->plan->monthly_charge : $store->subscription->plan->yearly_charge }}
    </li>
</ul>
</x-mail::panel>

Thanks,<br>
{{ config('app.name') }} Team
</x-mail::message>
