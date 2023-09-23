# Importing the datastore db

With the following command you can see the details of your database
gcloud firestore databases list

Add this to the main.tf file:

```
resource "google_project_service" "firestore" {
project = var.project_name
service = "firestore.googleapis.com"
}

resource "google_firestore_database" "default" {
project                           = var.project_name
name                              = "(default)"
location_id                       = "nam5"
type                              = "DATASTORE_MODE"
app_engine_integration_mode       = "ENABLED"

depends_on = [google_project_service.firestore]
}
```

Run the following command to import the datastore:
terraform import google_firestore_database.default "projects/<project-name>/databases/(default)"
