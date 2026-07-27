<x-mail::message>
    Feedback Provided By {{ $data['store'] }}
    <x-mail::panel>
        <ul>
            <li><strong>Feedback Type:</strong> {{ $data['feedback_type'] }}</li>
            <li><strong>Store Url:</strong> <a href="http://{{ $data['store'] }}">{{ $data['store'] }}</a></li>
            <li><strong>Feedback:</strong> {!!  $data['feedback'] !!}</li>
        </ul>
    </x-mail::panel>Thanks,<br>{{ config('app.name') }} team
</x-mail::message>
