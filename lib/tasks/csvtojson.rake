require 'json'
require 'open-uri'
require 'csv'


task :csvtojson => :environment do
    
    bikeRacks = open('http://vicmap.victoria.ca/_GISData/BikeRacks.csv').read
    
    bikeRacksjson = CSV.parse(bikeRacks)
    for ele in bikeRacksjson
        if ele[0] != 'OBJECTID'
            if not BikeRack.find_by(long: ele[3], lat: ele[4])
                a = BikeRack.new long:ele[3], lat:ele[4]
                a.save
            end
        end
    end
    
end