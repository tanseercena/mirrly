<x-mail::message>
    Hello,<br>
    Thank you for your purchase! Your ticket details are shown below. Keep this email as proof of your purchase.
    <x-mail::panel>
        <div>
            <h4>Ticket</h4>
            <div style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f2f2f2; display: flex; justify-content: center; align-items: center; height: auto;">
                <div style="background-color: #ffd700; color: #000; border: 2px solid #000; border-radius: 10px; width: 500px; padding: 20px; text-align: center; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">
                    <div style="margin-bottom: 20px;">
                        <h1 style="margin: 0; font-size: 36px; font-weight: bold;">{{ $store->setting->lottery_content['title'] }}</h1>
                        <h2 style="margin: 0; font-size: 28px; font-weight: bold;">{{ $store->setting->lottery_content['sub_title'] }}</h2>
                    </div>
                    <div style="margin: 20px 0; font-size: 32px; font-weight: bold; padding: 10px; border: 2px solid #000; display: inline-block; background-color: #fff;">{{ $ticket_no }}</div>
                    <div style="margin-top: 20px;">
                        <p style="margin: 5px 0; font-size: 18px;">{{ $store->setting->lottery_content['phone'] }}</p>
                        <p style="margin: 5px 0; font-size: 18px;"><a href="http://{{ $store->setting->lottery_content['site'] }}" style="text-decoration: none; color: #000; font-weight: bold;">{{ $store->setting->lottery_content['site'] }}</a></p>
                        <p style="margin: 5px 0; font-size: 18px;">{{ $store->setting->lottery_content['address'] }}</p>
                    </div>
                </div>
            </div>
        </div>
    </x-mail::panel>
    Thanks
</x-mail::message>
