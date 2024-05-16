kubectl create secret generic notes-secret --from-file=db-password=secrets/db_password --from-file=jwt-key=secrets/jwt_key
