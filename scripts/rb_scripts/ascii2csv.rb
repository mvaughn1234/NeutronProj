@scripts_dir = "./../"
@rb_dir = @scripts_dir+"./rb_scripts/"
@py_dir = @scripts_dir+"./py_scripts/"
@output_dir = @scripts_dir+"./../build/" # Where geant puts .root & .ascii files
@result_dir = @scripts_dir+"./../results/" # Where data is sorted to
@plots_dir = @result_dir+"./plots/"
@file_list = []

def gather_files(current_dir)
  Dir.entries(current_dir).each do |dir_entry|
    if File.directory?(current_dir+"/"+dir_entry) and not (dir_entry=~/^\.+/)
      gather_files(current_dir+dir_entry+"/")
    elsif (m = dir_entry=~/(.+)\.ascii$/)
      if not File.exists?(current_dir+$1+".csv")
        @file_list.push(current_dir+dir_entry)
      end
    end
  end
end

def ascii2csv(file_name)
  m = file_name =~ /^(.*)\.ascii$/
  chopped_name = $1
  csv_name = $1+".csv"
  puts "Converting "+$1
  csv_version = File.open(csv_name,'w+')
  File.foreach(file_name) do |line|
    if m = line=~/(\d+)\s+(-?\d+\.\d+)e([-+]\d+)\s+(-?\d+\.\d+)e([-+]\d+)/
      x = (($2.to_f)*(10**$3.to_i))
      y = (($4.to_f)*(10**$5.to_i))
      csv_line = x.to_s+","+y.to_s+"\n"
      csv_version.write(csv_line)
    end
  end
  csv_version.close()
end

gather_files(@result_dir)
if @file_list.empty? then puts "No new .ascii results found" end
@file_list.each{|file| ascii2csv(file)}
