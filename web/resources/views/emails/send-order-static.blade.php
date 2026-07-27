<x-mail::message>
    Hello,<br>
    Your digital products are ready for order {{$order['name']}}.
    <x-mail::panel>
        @if(!$preview)
            @foreach($digitalProducts as $digitalProduct)
                <div>
                    <h4>{{ $digitalProduct->associatedProduct['title'] }}
                        @if(isset($digitalProduct->associatedProduct['variants']))
                            @if($digitalProduct->associatedProduct['totalVariants'] == count($digitalProduct->associatedProduct['variants']))
                                (All Variants)
                            @else
                                {{ implode(",", collect($digitalProduct->associatedProduct['variants'])->pluck("title")->toArray()) }}
                            @endif
                        @endif
                    </h4>
                    <p>Files: </p>
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
    Thanks
</x-mail::message>
