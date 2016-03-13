require 'json'
require 'open-uri'
require 'csv'


task :csvtojson => :environment do
    
    bikeRacks = open('http://vicmap.victoria.ca/_GISData/BikeRacks.csv').read
    
    bikeRacksjson = CSV.parse(bikeRacks)
    BikeRack.delete_all
    for ele in bikeRacksjson
        if ele[0] != 'OBJECTID'
            a = BikeRack.new long:ele[3], lat:ele[4]
            a.save
        end
    end
    
end