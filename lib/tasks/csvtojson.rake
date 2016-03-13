require 'json'
require 'open-uri'
require 'csv'

task :csvtojson do
    
    bikeRacks = open('http://vicmap.victoria.ca/_GISData/BikeRacks.csv').read
    
    bikeRacksjson = CSV.parse(bikeRacks).to_json
    puts bikeRacksjson
    puts JSON.pretty_generate(bikeRacksjson)
    
end