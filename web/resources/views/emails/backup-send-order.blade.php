@component('mail::layout')
    @slot('header')
        @if($emailLogo)
            <img src="{{ $emailLogo['url'] }}" alt="Logo" style="max-width: 200px;  margin-top: 12px;">
        @endif
        @if(!empty($headerTitle))
            @component('mail::header', ['url' => config('app.url')])
                {{ $headerTitle }}
            @endcomponent
        @endif
    @endslot

    <x-mail::message>
        {!! str_replace(['{order_name}', '{full_name}'], [$order['name'], $first_name . ' ' . $last_name], $store->setting->email_content['intro_text'])  !!}
        <div style="text-align: center; margin-top: 20px;">
            <a href="{{ !$preview ? route('download.page', $order['checkout_token'] ?? $order['id']) : '#' }}" style="background-color: #2d3748; color: white; padding: 12px 24px; text-align: center; text-decoration: none; border-radius: 4px;">
                {{ $store->setting->email_content['download_button_text'] ?? 'Download' }}
            </a>
        </div>
        <x-mail::panel>
            @if(!$preview)
                @foreach($digitalProducts as $digitalProduct)
                    <div>
                        <h4>{{ $digitalProduct->associatedProduct['title'] }} -
                            @if(isset($digitalProduct->associatedProduct['variants']))
                                @php
                                    $variants = $digitalProduct->associatedProduct['variants'];
                                    $variantCount = count($variants);
                                @endphp
                                @if($variantCount > 1)
                                    (All Variants - {{ $variantCount }})
                                @else
                                    @foreach($variants as $variant)
                                        {{ $variant['title'] }}
                                    @endforeach
                                @endif
                            @endif
                        </h4>
                        @if (in_array('files', $digitalProduct->content_type))
                            <p>{{ $store->setting->email_content['file_title'] ?? 'Files' }}</p>
                            <ul>
                                @foreach($digitalProduct->attachedFiles as $file)
                                    <li><a href="{{ url('/download/' . base64_encode($file->id) . '/digital-file/'.$digitalProduct->id) }}" target="_blank">{{ $file->fileName }}</a></li>
                                @endforeach
                            </ul>
                        @endif
                        @if (in_array('license', $digitalProduct->content_type))
                            <p>{{ $store->setting->email_content['license_title'] ?? 'License' }}</p>
                            <ul>
                                @foreach($digitalProduct->licenses as $license)
                                    @php
                                        $licenseKeys = $license->generateLicenseKey($email, $id, $order['id'], $order, $digitalProduct, $store->setting);
                                    @endphp
                                    @if (count($licenseKeys) > 0)
                                        @foreach($licenseKeys as $licenseKey)
                                            @if(!empty($licenseKey))
                                                <li>{{ $licenseKey }}</li>
                                            @endif
                                        @endforeach
                                    @else
                                        <li>No Key Found - Contact Support</li>
                                    @endif
                                @endforeach
                            </ul>
                        @endif
                        @if (in_array('custom_link', $digitalProduct->content_type))
                            <p>{{ $store->setting->email_content['custom_link_title'] ?? 'Custom Link' }}</p>
                            <ul>
                                @foreach($digitalProduct->customLinks as $customLink)
                                    <li>
                                        <a href="{{ $customLink->redirect_url }}">{{ $customLink->redirect_url }}</a>
                                        <p>Details: {{ $customLink->link_details }}</p>
                                    </li>
                                @endforeach
                            </ul>
                        @endif
                    </div>
                @endforeach
            @else
                <div>
                    <h4>My Digital Product</h4>
                    <p>{{ $store->setting->email_content['file_title'] ?? 'Files' }}</p>
                    <ul>
                        <li><a href="#">Project_Proposal.pdf</a></li>
                        <li><a href="#">Business_Plan.docx</a></li>
                        <li><a href="#">Logo_Final.png</a></li>
                        <li><a href="#">Song_Title.mp3</a></li>
                        <li><a href="#">Novel_Title.epub</a></li>
                    </ul>
                </div>
            @endif
        </x-mail::panel>{!! str_replace(['{order_name}'], [$order['name']], $store->setting->email_content['footer_text']) !!}
    </x-mail::message>

    @slot('footer')
        @component('mail::footer')
            {!! $footerText !!}
        @endcomponent
    @endslot
@endcomponent
