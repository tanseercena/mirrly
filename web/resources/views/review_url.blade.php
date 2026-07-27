<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Review Email Template</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f8fafc;
            color: #1a202c;
            line-height: 1.6;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            margin-bottom: 24px;
            border-left: 4px solid #f59e0b;
        }

        .header h1 {
            font-size: 28px;
            font-weight: 700;
            color: #1a202c;
            margin-bottom: 8px;
        }

        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            background: #fef3c7;
            color: #92400e;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .review-info {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            margin-bottom: 24px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 20px;
        }

        .info-item {
            display: flex;
            flex-direction: column;
        }

        .info-label {
            font-size: 12px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }

        .info-value {
            font-size: 14px;
            color: #1a202c;
            font-weight: 500;
        }

        .links-detected {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 16px;
            margin-top: 16px;
        }

        .links-detected h3 {
            color: #dc2626;
            font-size: 16px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
        }

        .warning-icon {
            width: 20px;
            height: 20px;
            margin-right: 8px;
        }

        .links-list {
            list-style: none;
        }

        .links-list li {
            background: white;
            padding: 8px 12px;
            margin-bottom: 8px;
            border-radius: 6px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 13px;
            color: #dc2626;
            border-left: 3px solid #dc2626;
        }

        .template-preview {
            background: white;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            margin-bottom: 24px;
            overflow: hidden;
        }

        .preview-header {
            background: #f9fafb;
            padding: 16px 24px;
            border-bottom: 1px solid #e5e7eb;
        }

        .preview-header h2 {
            font-size: 18px;
            font-weight: 600;
            color: #374151;
        }

        .preview-content {
            padding: 24px;
            max-height: 600px;
            overflow-y: auto;
            border: 2px dashed #e5e7eb;
            background: #fafafa;
        }

        .template-html {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .action-buttons {
            display: flex;
            gap: 16px;
            justify-content: center;
            align-items: end;
            background: white;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            position: sticky;
            bottom: 20px;
        }

        .btn {
            padding: 12px 32px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 140px;
            justify-content: center;
        }

        .btn-approve {
            background: #10b981;
            color: white;
        }

        .btn-approve:hover {
            background: #059669;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
        }

        .btn-reject {
            background: #ef4444;
            color: white;
        }

        .btn-reject:hover {
            background: #dc2626;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
        }

        .btn-icon {
            width: 18px;
            height: 18px;
        }

        .comment-section {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            margin-bottom: 24px;
        }

        .comment-section h3 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
            color: #374151;
        }

        .comment-textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 14px;
            resize: vertical;
            min-height: 100px;
            font-family: inherit;
        }

        .comment-textarea:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        @media (max-width: 768px) {
            .container {
                padding: 16px;
            }
            
            .action-buttons {
                flex-direction: column;
                align-items: stretch;
            }
            
            .btn {
                width: 100%;
            }
            
            .info-grid {
                grid-template-columns: 1fr;
            }
        }

        /* Loading state */
        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .btn.loading {
            position: relative;
        }

        .btn.loading::after {
            content: '';
            position: absolute;
            width: 16px;
            height: 16px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        
        <!-- Header -->
        <div class="header">
            <h1>Email Template Review</h1>
            <span class="status-badge">{{($reviewTemplate->status === 'approved' || $reviewTemplate->status === 'not_approved' || $template->template_status === 'published' || $template->template_status === 'not_approved') ? 'Review Completed' : 'Pending Review'}}</span>
        </div>

        <!-- Template Info -->
        <div class="review-info">
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Template Name</span>
                    <span class="info-value">{{ $template->title ?? 'Welcome Email Template' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Created By</span>
                    <span class="info-value">{{ $template->store->shopify_domain ?? 'John Doe' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Created Date</span>
                    <span class="info-value">{{ $template->created_at->format('M d, Y H:i') ?? 'Dec 15, 2024 14:30' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Template ID</span>
                    <span class="info-value">#{{ $template->id ?? '12345' }}</span>
                </div>
            </div>

            <!-- Links Detected Warning -->
            <div class="links-detected">
                <h3>
                    <svg class="warning-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    Links Detected in Template
                </h3>

                <ul class="links-list">
                    @foreach($links as $link)
                        <li>{{$link}}</li>
                    @endforeach
                </ul>
            </div>
        </div>

        <!-- Comment Section -->
        @if(!in_array($template->template_status, ['published', 'not_approved']) && !in_array($reviewTemplate->status, ['approved', 'not_approved']))
        <div class="comment-section">
            <h3>Review Comments (Optional)</h3>
            <textarea class="comment-textarea" placeholder="Add any comments about this template review..."></textarea>
        </div>
        @endif

        <!-- Template Preview -->
        <div class="template-preview">
            <div class="preview-header">
                <h2>Template Preview</h2>
            </div>
            <div class="preview-content">
                <div class="template-html">
                    <!-- This is where the actual template HTML will be rendered -->
                    {!! $template->html ?? '<h2>Welcome to Our Service!</h2><p>Thank you for joining us. Click <a href="https://example.com/welcome">here</a> to get started.</p><p>Best regards,<br>The Team</p>' !!}
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        @if(!in_array($template->template_status, ['published', 'not_approved']) && !in_array($reviewTemplate->status, ['approved', 'not_approved']))

            <div class="action-buttons">

                <form method="POST" action="{{ route('template.approve', $reviewTemplate->id) }}" style="display: inline;">
                    @csrf

                    <div style="color: black">
                        <label>
                            <input checked type="checkbox" name="sendemail" value="1">
                            Send Email
                        </label>
                    </div>
                    <input type="hidden" name="comment" id="approveComment">
                    <button type="submit" class="btn btn-approve" id="approveBtn">
                        <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Approve Template
                    </button>
                </form>

                <form method="POST" action="{{ route('template.reject', $reviewTemplate->id) }}" style="display: inline;">
                    @csrf
                    <input type="hidden" name="comment" id="rejectComment">
                    <button type="submit" class="btn btn-reject" id="rejectBtn">
                        <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        Reject Template
                    </button>
                </form>
            </div>
        @endif
    </div>

    <script>
    const commentTextarea = document.querySelector('.comment-textarea');

    // Auto-resize textarea
    commentTextarea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });

    // Approve form
    const approveForm = document.querySelector('form[action*="approve"]');
    const approveBtn = approveForm.querySelector('button');
    approveForm.addEventListener('submit', function (e) {
        document.getElementById('approveComment').value = commentTextarea.value;

        approveBtn.classList.add('loading');
        approveBtn.disabled = true;

        const icon = approveBtn.querySelector('.btn-icon');
        if (icon) icon.style.display = 'none';

        const label = approveBtn.querySelector('span');
        if (label) label.textContent = 'Approving...';
    });

    // Reject form
    const rejectForm = document.querySelector('form[action*="reject"]');
    const rejectBtn = rejectForm.querySelector('button');
    rejectForm.addEventListener('submit', function (e) {
        if (!confirm('Are you sure you want to reject this template?')) {
            e.preventDefault();
            return;
        }

        document.getElementById('rejectComment').value = commentTextarea.value;

        rejectBtn.classList.add('loading');
        rejectBtn.disabled = true;

        const icon = rejectBtn.querySelector('.btn-icon');
        if (icon) icon.style.display = 'none';

        const label = rejectBtn.querySelector('span');
        if (label) label.textContent = 'Rejecting...';
    });
</script>

</body>
</html>
