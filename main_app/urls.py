from django.urls import path, include
from main_app import views
from .models import Job

# Template tag
app_name = 'main_app'

urlpatterns = [
	path('pipeline/', views.pipelineView.as_view(), name="pipeline"),
	path('pipeline/<int:year>/<int:month>/', views.pipelineView.as_view(), name="pipeline-by-month"),
	# path('costsheet/<str:job_code>/', views.costsheetView.as_view(), name="costsheet"),
	path('cost-add/<pk>/', views.CostCreateView.as_view(), name="cost-add"),
	path('<cost_id>/delete-cost/', views.CostDeleteView, name="cost-delete"),
	path('<pk>/update-cost/', views.CostUpdateView.as_view(), name="cost-update"),
	path('<pk>/delete-job/', views.JobDeleteView.as_view(), name="job-delete"),
	path('<pk>/update-job/', views.JobUpdateView.as_view(), name="job-update"),
	path('<pk>/job-detail/', views.JobDetailView.as_view(), name="job-detail"),
	path('export/', views.CSV_Write, name="csv-write"),
	path('import-client/', views.importClients, name="import-client"),
	path('import-job/', views.importJobs, name="import-job"),
	path('import-vendor/', views.importVendors, name="import-vendor"),
	path('invoice-request/', views.InvoicesView, name="invoice-request-page"),
	path('invoice-request-submit/', views.RequestVendorInvoices, name="invoice-request-send"),
	path('add-client/', views.ClientCreateView.as_view(), name="client-add"),
	path('client-list/', views.ClientListView.as_view(), name="client-list"),
	path('vendors/<pk>', views.VendorDetailView.as_view(), name="vendors-detail"),
	path('add-vendor/', views.VendorCreateView.as_view(), name="vendor-add"),
	path('vendor-list/', views.VendorListView.as_view(), name="vendor-list"),
	path('remove-vendor-from-job/<job_id>/<pk>/', views.VendorRemoveFromJob, name="remove-vendor-from-job"),
	path('upload-invoice/<vendor_uuid>', views.invoice_upload_view, name="upload-invoice"),
	path('upload-invoice-success/', views.upload_invoice_success, name="upload-invoice-success"),
	path('no-invoices/', views.invoice_error, name="no-invoices"),
	path('file-handler/', views.handle_uploaded_file, name="file-handler"),
	path('pipeline-data/<int:year>/<int:month>/', views.pipeline_data, name="pipeline-data"),
	path('pipeline-data/', views.pipeline_data, name="pipeline-data"),


]

