'use strict';

import '../../../assets/scss/pipeline.scss';
import * as bootstrap from 'bootstrap';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import { initTable } from './invoices-dt.js';
import { extendSearch, setupSortByStatus } from './invoices_common.js';
import { setupTableEventHandlers } from './invoices-dt-ui-funcs.js';

initTable();
setupTableEventHandlers();
extendSearch();
setupSortByStatus();
