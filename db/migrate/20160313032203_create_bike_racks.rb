class CreateBikeRacks < ActiveRecord::Migration
  def change
    create_table :bike_racks do |t|
      t.float :long
      t.float :lat

      t.timestamps
    end
  end
end
