 
  <div class="maindiv">
    <div class="container">
	
      <ul class="nav nav-tabs">
        <li class="active">
          <a data-toggle="tab" href="#home">Inventory</a>
        </li>
        <li>
          <a data-toggle="tab" href="#repo">Reposession</a>
        </li>
        <li>
          <a data-toggle="tab" href="#menu2">Auction</a>
        </li>
      </ul>
	  
      <div class="tab-content">
        <div id="home" class="tab-pane fade in active">
		<div>
		<button id="filtersbtn" onclick="openfiltersetup()" class="btn">Filters</button>
		</div>
		<div class="container mt-4">
    <div class="row">
         
		<div id="selectBoxContainer"></div>
		</div> 
		</div>
		 

		<div class="table-responsive">
          <table id="data-table" class="table table-bordered">
            <thead>
              <tr id="table-header"></tr>
            </thead>
            <tbody id="table-body"></tbody>
          </table>
		  <nav>
				<ul class="pagination" id="pagination"></ul>
			</nav>
        </div>
        </div>
      </div>
    </div>
  </div> 