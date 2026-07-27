<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pending Template</title>
  <style>

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
      background-color: #f6f6f7;
      padding: 20px;
    }

    .table-container {
      overflow-x: auto;
      border: 1px solid #dfe3e8;
      border-radius: 8px;
      background-color: #ffffff;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 600px;
    }

    thead {
      background-color: #f9fafb;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    th, td {
      text-align: left;
      padding: 12px 16px;
      border-bottom: 1px solid #dfe3e8;
    }

    th {
      font-size: 13px;
      font-weight: 600;
      color: #637381;
    }

    tbody tr:hover {
      background-color: #f4f6f8;
    }

    tbody tr:nth-child(even) {
      background-color: #fcfcfc;
    }

    td {
      font-size: 14px;
      color: #212b36;
    }

    caption {
	  caption-side: top;
	  text-align: left;
	  font-size: 18px;
	  font-weight: 600;
	  color: #212b36;
	  padding: 16px;
	  background-color: #ffffff;
	}

    @media (max-width: 768px) {
      th, td {
        padding: 10px 12px;
      }
    }
  </style>
</head>
<body>

<div class="table-container">
  <table>

  	<caption>Pending Templates</caption>
    <thead>
      <tr>
        <th>ID</th>
        <th>TITLE</th>
        <th>STATUS</th>
        <th>STORE</th>
        <th>ACTION</th>
      </tr>
    </thead>
    <tbody>
      @foreach($pendingTemplates as $template)
      <tr>
        <td>{{$template->id}}</td>
        <td>{{$template->title}}</td>
        <td>In Review</td>
        <td>{{$template->store->shopify_domain}}</td>
        <td><a href="{{route('review.url', $template->id)}}" style="display: inline-block; padding: 8px 16px; background-color: #3490dc; color: white; text-decoration: none; border-radius: 4px;">Review Template</a></td>
      </tr>
      @endforeach
      
    </tbody>
  </table>
</div>

</body>
</html>
