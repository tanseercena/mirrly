<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body>
	@if($status === "Approved")
		<div>
			<p>Hi <strong>{{$template->store->shopify_domain}},</strong></p>
			<br>
			<p>
				Good news! Your email template <strong>{{$template->title}}</strong> has been approved and now live 
			</p>
			<br>
			<p>You can start using it in your campaigns immediately</p>
			<br>
			<p>Best Regards,</p>
			<span>Review Team</span>
		</div>
	@else
		<div>
			<p>Hi <strong>{{$template->store->shopify_domain}},</strong></p>
			<br>
			<p>
				Your email template <strong>{{ $template->title }} </strong> needs some adjustments before approval.
			</p>
			<br>

			@if($comment)
				<p><strong>Review notes:</strong> {{ $comment }}</p>
				<br>
			@endif

			<div>
				<h5>Common issues</h5>
				<ul>
					<li>Suspicious or unsafe links</li>
					<li>Policy violations</li>
					<li>Formatting problems</li>
				</ul>
			</div>

			<p>Please review and resubmit your template</p>
			<br>
			<p>Best Regards,</p>
			<span>Review Team</span>
		</div>
	@endif
</body>
</html>
