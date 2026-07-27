<!DOCTYPE html>
<html>
<head>
	<title>Confirm Your Password</title>
	<style>
		.modal {
		    display: block; /* Show on page load */
		    position: fixed; 
		    z-index: 1000; 
		    left: 0;
		    top: 0;
		    width: 100%; 
		    height: 100%; 
		    overflow: auto; 
		    background-color: rgba(0,0,0,0.5); 
		}

		.modal-content {
		    background-color: #fff;
		    margin: 15% auto; 
		    padding: 20px;
		    border-radius: 8px;
		    max-width: 400px;
		    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
		    position: relative;
		}

		.close-btn {
		    color: #aaa;
		    position: absolute;
		    top: 10px;
		    right: 15px;
		    font-size: 24px;
		    font-weight: bold;
		    cursor: pointer;
		    transition: color 0.3s ease;
		}
		.close-btn:hover {
		    color: #000;
		}
	</style>
</head>
<body>

	<form action="{{ route('show.pending.review') }}" method="POST">
		@csrf
		<div id="myModal" class="modal">
		  <div class="modal-content">

		  	<h2>Confirm Password</h2>

		    <div style="display: flex; flex-direction: column; margin-top: 16px">
		    	<label>Password</label>
		    	<input type="text" name="password" required />
		    </div>

		    <div style="margin-top: 15px;">
		    	<button type="submit">Submit</button>
		    </div>
		  </div>
		</div>
	</form>

	<script>
	  const modal = document.getElementById("myModal");
	  const closeBtn = document.getElementById("closeModalBtn");

	  closeBtn.onclick = () => {
	    modal.style.display = "none";
	  };

	  window.onclick = (event) => {
	    if (event.target === modal) {
	      modal.style.display = "none";
	    }
	  };
	</script>
</body>
</html>
