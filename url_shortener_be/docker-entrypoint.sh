#!/bin/sh

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z postgres 5432; do
  sleep 0.1
done
echo "PostgreSQL is ready!"

# Run migrations
echo "Running database migrations..."
npx sequelize-cli db:migrate

# Run seeders if in development
if [ "$NODE_ENV" = "development" ]; then
  echo "Running database seeders..."
  npx sequelize-cli db:seed:all
fi

# Start the application
echo "Starting the application..."
exec "$@" 