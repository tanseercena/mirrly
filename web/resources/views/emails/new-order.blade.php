@component('mail::layout')
    @slot('header')
        @component('mail::header', ['url' => config('app.url')])
            {{ $headerTitle }}
        @endcomponent
    @endslot

    <x-mail::message>
        {!! str_replace(['{order_name}', '{full_name}'], [$order['name'], $first_name . ' ' . $last_name], $store->setting->email_content['intro_text']) !!}
        
        <x-mail::panel>
            @if(!$preview)
                @foreach($digitalProducts as $digitalProduct)
                    <div>
                        <h4>{{ $digitalProduct->associatedProduct['title'] }}</h4>
                        <p>{{ $store->setting->email_content['file_title'] }}</p>
                        <ul>
                            @foreach($digitalProduct->attachedFiles as $file)
                                <li><a href="{{ $file->url }}">{{ $file->fileName }}</a></li>
                            @endforeach
                        </ul>
                    </div>
                @endforeach
            @else
                <div>
                    <h4>My Digital Product</h4>
                    <p>{{ $store->setting->email_content['file_title'] }}</p>
                    <ul>
                        <li><a href="#">Project_Proposal.pdf</a></li>
                        <li><a href="#">Business_Plan.docx</a></li>
                        <li><a href="#">Logo_Final.png</a></li>
                        <li><a href="#">Song_Title.mp3</a></li>
                        <li><a href="#">Novel_Title.epub</a></li>
                    </ul>
                </div>
            @endif
        </x-mail::panel>
        
    </x-mail::message>

    @slot('footer')
        @component('mail::footer')
            {!! $footerText !!}
        @endcomponent
    @endslot
@endcomponent
