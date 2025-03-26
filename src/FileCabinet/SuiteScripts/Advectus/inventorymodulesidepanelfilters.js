/**
 * @NApiVersion 2.1
 */
define([],

    () => {

        const sidepanelfilters = () => {

                        <style>
                                .sidebar {
                                width: 250px;
                                height: 100vh;
                                position: fixed;
                                left: -250px;
                                top: 0;
                                background: #f8f9fa;
                                transition: all 0.3s ease;
                                padding: 15px;
                        }
                                .sidebar.show {
                                left: 0;
                        }
                                .filter-remove {
                                cursor: pointer;
                        }
                        </style>


                <div class="container mt-3">
                        <!-- Breadcrumb Filters -->
                        <nav aria-label="breadcrumb">
                                <ol class="breadcrumb">
                                        <li class="breadcrumb-item active filter-remove" onclick="removeFilter(this)">Category: Electronics</li>
                                        <li class="breadcrumb-item active filter-remove" onclick="removeFilter(this)">Price: $100 - $500</li>
                                        <li class="breadcrumb-item active filter-remove" onclick="removeFilter(this)">Brand: Samsung</li>
                                </ol>
                        </nav>

                        <!-- Toggle Sidebar Button -->
                        <button class="btn btn-primary" onclick="toggleSidebar()">Filters</button>

                        <!-- Sidebar -->
                        <div class="sidebar" id="sidebar">
                                <button class="btn btn-danger btn-sm mb-3" onclick="toggleSidebar()">Close</button>
                                <h5>Filters</h5>
                                <form>
                                        <div class="mb-3">
                                                <label class="form-label">Category</label>
                                                <select class="form-select">
                                                        <option>Electronics</option>
                                                        <option>Fashion</option>
                                                        <option>Home & Garden</option>
                                                </select>
                                        </div>
                                        <div class="mb-3">
                                                <label class="form-label">Price Range</label>
                                                <input type="range" class="form-range">
                                        </div>
                                        <div class="mb-3">
                                                <label class="form-label">Brand</label>
                                                <input type="text" class="form-control" placeholder="Enter brand">
                                        </div>
                                        <button type="submit" class="btn btn-success">Apply Filters</button>
                                </form>
                        </div>
                </div>

                <script>
                        function toggleSidebar() {
                        document.getElementById('sidebar').classList.toggle('show');
                }

                        function removeFilter(element) {
                        element.remove();
                }
                </script>
 
        }



        return {sidepanelfilters}

    });
