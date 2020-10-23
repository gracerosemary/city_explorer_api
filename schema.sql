-- checks to see if location exists and if it does, drop it
DROP TABLE if exists location;

-- recreate what we need
CREATE TABLE location (
    id SERIAL PRIMARY KEY, 
    latitude FLOAT8, 
    longitude FLOAT8, 
    search_query VARCHAR(255),
    formatted_query VARCHAR(255)
);

