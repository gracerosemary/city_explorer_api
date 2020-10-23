-- checks to see if people exists and if it does, drop it
DROP TABLE if exists location;

-- recreate what we need
CREATE TABLE location (
    search_query SERIAL PRIMARY KEY, 
    lat VARCHAR(255), 
    lon VARCHAR(255), 
    formatted_query VARCHAR(255)
);

