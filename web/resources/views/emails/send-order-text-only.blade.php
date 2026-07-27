@if(!empty($headerTitle))
{{ $headerTitle }}
@endif

---

{!! strip_tags($introText) !!}

---

@if(isset($store->setting->email_content['download_button_text']) && !empty($store->setting->email_content['download_button_text']))
{{ $store->setting->email_content['download_button_text'] ?? 'Download' }}: {{ !$preview ? route('download.page', $order['checkout_token'] ?? $order['id']) : '#' }}
@endif

@foreach($order['line_items'] as $lineItem)
@php
$digitalProduct = getDigitalProductByLineItem($store, $lineItem);
@endphp

@if($digitalProduct)
============================================================
{{ $lineItem['name'] }} | Quantity: {{ $lineItem['quantity'] }}
============================================================

@if (in_array('files', $digitalProduct->content_type) && ($store->setting->email_content['show_files'] ?? true))
{{ $store->setting->email_content['file_title'] ?? 'Files' }}:
@foreach($digitalProduct->attachedFiles as $file)
- {{ $file->fileName }}: {{ url('/download/' . base64_encode($file->id) . '/digital-file/' . $digitalProduct->id) }}
@endforeach
@endif

@if (in_array('license', $digitalProduct->content_type) && ($store->setting->email_content['show_license_keys'] ?? true))
{{ $store->setting->email_content['license_title'] ?? 'License' }}:
@foreach($digitalProduct->licenses as $license)
@if (isset($licenses[$digitalProduct->id][$license->id]) && count($licenses[$digitalProduct->id][$license->id]) > 0)
@foreach($licenses[$digitalProduct->id][$license->id] as $licenseArrKey)
@foreach($licenseArrKey as $licenseKey)
@if(!empty($licenseKey))
- {{ $licenseKey }}
@endif
@endforeach
@endforeach
@else
- No Key Found - Contact Support
@endif
@endforeach
@endif

@if (in_array('custom_link', $digitalProduct->content_type) && ($store->setting->email_content['show_custom_links'] ?? true))
{{ $store->setting->email_content['custom_link_title'] ?? 'Custom Link' }}:
@foreach($digitalProduct->customLinks as $customLink)
@if (isset($store->setting->email_content['enable_custom_link_button']) && $store->setting->email_content['enable_custom_link_button'])
- {{ $store->setting->email_content['custom_link_button_text'] ?? 'Click Here' }}: {{ $customLink->redirect_url }}
@else
- Link: {{ $customLink->redirect_url }}
@endif
Details: {{ $customLink->link_details }}
@endforeach
@endif

@endif
@endforeach

---

{!! strip_tags($footer_text) !!}

---

{!! strip_tags($footerText) !!}
