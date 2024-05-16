docker build -t epicpigeon/auth_service:1 -f authentication_service/Dockerfile .
docker build -t epicpigeon/backend:1 -f backend/Dockerfile .
docker build -t epicpigeon/frontend:1 -f frontend/Dockerfile frontend
