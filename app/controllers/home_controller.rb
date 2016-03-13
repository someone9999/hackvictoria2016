class HomeController < ApplicationController
    
    skip_before_action :verify_authenticity_token, :only => [:save]
    
    def index
        load_racks
    end
    
    def add
        load_racks
    end
    
    def save
        (BikeRack.new(lat: params[:lat], long: params[:long])).save
        head 200
    end
    
    
private
    
    def load_racks
        racks = BikeRack.all.map do |r|
            next {:lat => r.lat, :long => r.long}
        end
        
        @racksJson = racks.to_json
        puts @racksJson
    end
end
