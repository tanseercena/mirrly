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
        {!! $introText !!}
        @if(isset($store->setting->email_content['download_button_text']) && !empty($store->setting->email_content['download_button_text']))
            <div style="text-align: center; margin-top: 20px;">
                <a href="{{ !$preview ? route('download.page', $order['checkout_token'] ?? $order['id']) : '#' }}" style="background-color: #2d3748; color: white; padding: 12px 24px; text-align: center; text-decoration: none; border-radius: 4px;">
                    {{ $store->setting->email_content['download_button_text'] ?? 'Download' }}
                </a>
            </div>
        @endif
        <x-mail::panel>
            @if(!$preview)
                @foreach($order['line_items'] as $lineItem)
                    @php
                        $digitalProduct = getDigitalProductByLineItem($store, $lineItem);
                        if(isset($digitalProduct->id) && $updated_resend && $digitalProduct->id != $digitalProducts->first()->id) {
                            continue;
                        }
                    @endphp
                    @if($digitalProduct)
                        <div>
                            <h4>{{ $lineItem['name'] }}
                                @if(($store->setting->email_content['show_product_qty'] ?? true))
                                | <span>x {{ $lineItem['quantity'] }}</span>
                                @endif
                            </h4>
                            @if (in_array('files', $digitalProduct->content_type) && ($store->setting->email_content['show_files'] ?? true))
                                <p>{{ $store->setting->email_content['file_title'] ?? 'Files' }}</p>
                                <ul>
                                    @foreach($digitalProduct->attachedFiles as $file)
                                        @if($digitalProduct->enable_pdf_stamping && strtolower(pathinfo($file->fileName, PATHINFO_EXTENSION)) == 'pdf')
                                            <li><a href="{{ url('/download-stamped/' . base64_encode($file->id) . '/digital-file/'.$digitalProduct->id.'/'.$order['id']) }}" target="_blank">{{ $file->fileName }}</a></li>
                                        @else
                                            <li><a href="{{ url('/download/' . base64_encode($file->id) . '/digital-file/'.$digitalProduct->id.'/'.$order['id']) }}" target="_blank">{{ $file->fileName }}</a></li>
                                        @endif
                                    @endforeach
                                </ul>
                            @endif
                            @if (in_array('license', $digitalProduct->content_type) && ($store->setting->email_content['show_license_keys'] ?? true))
                                <p>{{ $store->setting->email_content['license_title'] ?? 'License' }}</p>
                                <ul>
                                    @foreach($digitalProduct->licenses as $license)
                                        @if (count($licenses[$digitalProduct->id][$license->id]) > 0)
                                            @foreach($licenses[$digitalProduct->id][$license->id] as $licenseArrKey)
                                                @foreach($licenseArrKey as $licenseKey)
                                                    @if(!empty($licenseKey))
                                                        <li style="margin-top: 15px">
                                                            {{ $licenseKey }}
                                                            @if($license->qr_code_enabled)
                                                                <div style="margin-top: 10px; text-align: right">
                                                                    <img src="{{ generateQrCode($digitalProduct->store_id, $licenseKey) }}" alt="QR Code" style="width: 200px; height: 200px;" />
                                                                </div>
                                                            @endif
                                                        </li>
                                                    @endif
                                                @endforeach
                                            @endforeach
                                        @else
                                            <li>No Key Found - Contact Support</li>
                                        @endif
                                    @endforeach
                                </ul>
                            @endif
                            @if (in_array('custom_link', $digitalProduct->content_type) && ($store->setting->email_content['show_custom_links'] ?? true))
                                <p>{{ $store->setting->email_content['custom_link_title'] ?? 'Custom Link' }}</p>
                                <ul style="list-style: none">
                                    @foreach($digitalProduct->customLinks as $customLink)
                                        <li>
                                            @if (isset($store->setting->email_content['enable_custom_link_button']) && $store->setting->email_content['enable_custom_link_button'])
                                                <a href="{{ $customLink->redirect_url }}" style="background-color: #6297f1; color: white; padding: 6px 12px; text-align: center; text-decoration: none; border-radius: 4px; display: inline-block;margin-bottom: 5px;">
                                                    {{ $store->setting->email_content['custom_link_button_text'] ?? 'Click Here' }}
                                                </a>
                                            @else
                                                <a href="{{ $customLink->redirect_url }}">
                                                    {{ $customLink->redirect_url }}
                                                </a>
                                            @endif
                                            <p>Details: {{ $customLink->link_details }}</p>
                                        </li>
                                    @endforeach
                                </ul>
                            @endif
                        </div>
                    @endif
                @endforeach
            @else
                <div>
                    <h4>My Digital Product
                        @if(($store->setting->email_content['show_product_qty'] ?? true))
                            | <span>x 2</span>
                        @endif
                    </h4>
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
        </x-mail::panel>{!! $footer_text !!}
    </x-mail::message>

    @slot('footer')
        @component('mail::footer')
            {!! $footerText !!}
        @endcomponent
    @endslot
@endcomponent
