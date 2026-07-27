<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lottery Ticket</title>
        <style>
            .ticket-container {
                position: relative;
                width: 690px;
                height: 300px;
                background: url('{{ asset('custom_tickets/ticket_' . $ticket_no . '_' . $store->id . '.png') }}') no-repeat;
                background-size: cover;
                text-align: center;
                border-radius: 10px;
                padding: 8px;
            }

            .ticket-content {
                margin-top: 160px;
            }

            .content-text {
                color: #000;
            }

            .header {
                /*margin-top: -15px;*/
            }

            .header h1,
            .header h2 {
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
                /*margin: 5px 0;*/
                display: inline-block;
                font-size: 26px;
                font-weight: bold;
                padding: 10px 20px;
                /*border: 2px solid #000;*/
                /*background-color: #000;*/
                color: #fff;
            }

            .info {
                width: 80%;
                margin: 0px auto;
                border-top: 2px solid #000;
            }

            .info p {
                font-size: 18px;
                color: #222;
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

        <p class="content-text">
            {!! str_replace(['{customer_name}', '{lottery_title}'], [$first_name . ' ' . $last_name, $store->setting->lottery_content['title']], $store->setting->lottery_content['lottery_header_text'])  !!}
        </p>
        <br>

        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;">
            <tr>
                <td align="center">
                    <img
                         src="{{ Storage::url('duser_'.$store->id.'/tickets'  . '/ticket_' . $ticket_no. '_'. $lottery->id . '.png') }}"
                        alt="Lottery Ticket No: {{ $ticket_no }}" width="100%" style="display: block; max-width: 100%;">
                </td>
            </tr>
        </table>

        <br>
        <p class="content-text">
            {!! $store->setting->lottery_content['lottery_footer_text'] ?? '' !!}
        </p>

        <div style="margin-top: 25px;"></div>
        <p style="text-align: center; color: gray; font-size: 15px">
            {!! $store->setting->lottery_content['contact_details'] ?? '' !!}
        </p>
    </body>
</html>
