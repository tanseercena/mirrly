<x-mail::message>
# Your try-on video

Nice look! Your try-on recording of **{{ $productTitle }}** is ready.

<x-mail::button :url="$downloadUrl">
Download your video
</x-mail::button>

This link works until {{ $expiresLabel }} — after that the recording is deleted automatically.

Thanks,<br>
{{ $storeName }}
</x-mail::message>
