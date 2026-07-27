<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lottery Ticket</title>
        <style>
            .ticket-container {
                position: relative;
                width: 680px;
                /*height: 260px;*/
                background: url('{{ asset('images/ticket_bg.png') }}') no-repeat;
                /*background-size: cover;*/
                text-align: center;
                border-radius: 10px;
                padding: 8px;
            }

            .header {
                /*margin-top: -15px;*/
            }
            .header h1, .header h2 {
                margin: 0;
                color: #000;
            }
            .header h1 {
                font-size: 50px;
                font-weight: bold;
                /*padding-top: 10px;*/
            }
            .header h2 {
                font-size: 35px;
                font-weight: bold;
            }
            .code {
                margin: 5px 0;
                display: inline-block;
                font-size: 32px;
                font-weight: bold;
                padding: 10px 20px;
                border: 2px solid #000;
                background-color: #000;
                color: #fff;
            }
            .info {
                width: 80%;
                margin: 0px auto;
                border-top: 2px solid #000;
            }
            .info p {
                font-size: 18px;
            }
            .info div {
                overflow: hidden;
            }
            .info div p {
                width: 50%;
                float: left;
            }
            .info .phone {
                text-align: left;
            }
            .info .site {
                text-align: right;
            }

            .info .address {
                border-top: 2px solid #000;
                padding-top: 5px;
            }

            .info p {
                margin: 5px 0;
                font-size: 18px;
                color: #000;
            }
            .info a {
                text-decoration: none;
                color: #000;
            }
        </style>
    </head>
    <body>
        <h1 style="text-align: center;">
            {!! $store->setting->lottery_content['company_name'] ?? '' !!}
        </h1>
        <div style="margin-top: 25px;"></div>

        <p>
            {!! str_replace(['{customer_name}', '{lottery_title}'], [$first_name . ' ' . $last_name, $store->setting->lottery_content['title']], $store->setting->lottery_content['lottery_header_text'])  !!}
        </p>

        <div class="ticket-container">
            <div class="ticket-content">
                <div class="header">
                    <h1>{{ $store->setting->lottery_content['title'] ?? 'Lottery' }}</h1>
                    <h2>{{ $store->setting->lottery_content['sub_title'] ?? 'Ticket' }}</h2>
                </div>
                <div class="code">{{ $ticket_no }}</div>
                <div class="info">
                    <div>
                        <p class="phone">{{ $store->setting->lottery_content['phone'] ?? '' }}</p>
                        <p class="site"><a
                                href="http://{{ $store->setting->lottery_content['site'] ?? '#' }}">{{ $store->setting->lottery_content['site'] ?? '' }}</a>
                        </p>
                    </div>
                    <p class="address">{{ $store->setting->lottery_content['address'] ?? '' }}</p>
                </div>
            </div>
        </div>

        <p>
            {!! $store->setting->lottery_content['lottery_footer_text'] ?? '' !!}
        </p>

        <div style="margin-top: 25px;"></div>
        <p style="text-align: center; color: gray; font-size: 15px">
            {!! $store->setting->lottery_content['contact_details'] ?? '' !!}
        </p>
    </body>
</html>
