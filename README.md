const API_BASE = "http://localhost:8000"; // your backend IP
psql -U postgres -d protein_store 
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/protein_store


psql -U postgres -d protein_store
Admindashboard
Productdetail
ProductService.js
Productcard
config.js

docker run -d   --name protein_postgres   -e POSTGRES_USER=postgres   -e POSTGRES_PASSWORD=postgres   -e POSTGRES_DB=protein_store   -p 5432:5432   -v pgdata:/var/lib/postgresql/data   postgres:15

