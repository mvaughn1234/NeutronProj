=begin
- run configs -> put into root/results/dump:configID/raw
- in same process run ascii2csv on single file that was just moved to above path
- put csv in root/results/dump/configID/csv
- convert ascii to db format & put in root/

=end

require 'set'
require 'bigdecimal'
require 'json'
# Important structures
# To be populated by setup
@mats = []
@energies = []
@lengths = []
@sizes = []
@erange = false
@each = false # True: Test each material at each energy and again at each length
@together = false # True: Test the materials in the configuration listed in the input
@settings = [] # Will hold each test configuration (some mat, @ some energy, @ some length)
@set
@clean = false
@process_counter = 20

# To check for validity of input
@allowed_mats = ["molybdinum", "moly", "bh303", "beryllium", "graphite", "tin", "vacuum"]
@allowed_energies = [] # Check to make sure the input energy is valid
@length_min, @length_max = 1, 100 # Min/max lengths (cm)

# For relocating data
@root = "/home/student/geant4/NeutronProj/"
@scripts_dir = @root + "./scripts/"
@rb_dir = @scripts_dir + "./rb_scripts/"
@py_dir = @scripts_dir + "./py_scripts/"
@output_dir = @root + "./build/" # Where geant puts .root & .ascii files
@result_dir = @root + "./results/" # Where data is sorted to
@plots_dir = @result_dir + "./plots/"
@temp_num = 0

def logspace(a, b, n)
  (0...n).map do |i|
    t = BigDecimal(i) / (n - 1)
    10 ** ((1 - t) * a + t * b)
  end
end

def linspace(low, high, num)
  [*0..(num - 1)].collect {|i| low + i.to_f * (high - low) / (num - 1)}
end

def setup(input)
  data_hash = JSON.parse(File.read(String(input[0])))[0]["configs"]
  puts String(data_hash)
  data_hash.each do |config|
    matlist = config["matList"]
    lenList = config["lenList"]
    energy = config["energy"]
    @settings.push([:materials => matlist, :energy => energy, :lengths => lenList])
  end
end

# Create directory for result (if doesn't exist)
def make_dir(output_path)
  constructed_dir = ""
  i = 0

  folders = output_path.split("/")
  folders.each {|subdir|
    if (i == 0)
      constructed_dir = subdir
    else
      constructed_dir = constructed_dir + "/" + subdir
    end
    i += 1
    if not (Dir.exist? constructed_dir)
      puts("Constructed dir: " + constructed_dir)
      Dir.mkdir constructed_dir
    end
  }
end

# def temp_fix_for_ascii(test_case)
#   file_name = "./"+test_case[:material]+"_"+test_case[:length]+"cm*"
#   fix_name = "./"+test_case[:material]+"_"+test_case[:length]+"cm_Ene_"+
#       test_case[:energy]+"_MeV.ascii"
#   system("cp "+file_name+" "+fix_name)
#   # system("rm "+file_name)
# end

# Put files in proper place
def relocate(test_case)
  # temp_fix_for_ascii(test_case)
  file_name = String(test_case[0][:materials][0]) + "_" + String(test_case[0][:lengths][0]) + "cm*"
  path_original = "./" + file_name
  path_final = @result_dir + String(test_case[0][:materials][0]) + "/" + String(test_case[0][:lengths][0])
  relocate_cmd = "find ./ -name '" + file_name + "' -exec mv '{}' '" + path_final + "/' ';'"
  make_dir(path_final)
  system(relocate_cmd)
  # if Dir.exists? @output_dir
  #   puts "original path: #{path_original}"
  #   if File.exists? path_original
  #   end
  # end
end

def copy_and_edit(test_case)
  test_case = test_case[0]
  runmac_path = @output_dir + "run1.mac"
  temp_name = rand(99999999).to_s
  @temp_num = temp_name
  edited = temp_name + "_edited.mac"
  log = temp_name + "_log.out"
  output_file_name = String(test_case[:materials][0]) + "_" + String(test_case[:lengths][0]) + "cm_Ene_" + String(test_case[:energy]) + "_MeV"
#  puts 'edited: ', edited, ' log: ', log, ' out: ', output_file_name
  if File.exist?(runmac_path)
    temp_name = @output_dir + temp_name + ".mac"
    edited = @output_dir + edited
    log = @output_dir + log
    cmd = "cp " + runmac_path + " " + temp_name
    system(cmd)
  else
    puts "No run.mac found in " + @output_dir
    return
  end
  dest = File.new(edited, "w+")
  File.foreach(temp_name) do |line|
    for i in (1..test_case[:materials].size())
      if line =~ /^\/testhadr\/det\/setRadius#{i} \d+ cm$/
        line = "/testhadr/det/setRadius#{i} " + String(test_case[:lengths][i-1]) + " cm\n"
      elsif line =~ /^\/testhadr\/det\/setMat#{i} \w+$/
        line = "/testhadr/det/setMat#{i} " + String(test_case[:materials][i-1]) + "\n"
      end
    end
    if line =~ /\/gun\/energy \d+.\d+ \weV/
      line = "/gun/energy " + String(test_case[:energy]) + " MeV\n"
    elsif line =~ /^\/analysis\/setFileName .*\.(\w+)$/
      line = "/analysis/setFileName " + output_file_name + "." + $1 + "\n"
    end
    dest.write(line)

  end

  dest.close
  return edited, log
end

def clean()
  system("rm " + @output_dir + @temp_num.to_s + "*")
end

# Run geant for each setting on separate process
def run_tests()
  Signal.trap("CLD") {@process_counter += 1}
  for setting in @settings
    Process.wait if @process_counter <= 0
    @process_counter -= 1
    fork do
      temp_name, log = copy_and_edit(setting)
      puts "Running: " + String(setting[0][:materials]) + " " + String(setting[0][:lengths]) + "cm " + String(setting[0][:energy]) + "MeV"
      cmd = String(@output_dir) + "Hadr06 " + String(temp_name) + " > " + String(log)
      system(@output_dir + "Hadr06 " + temp_name + " > " + log)
      relocate(setting)
      clean()
    end
  end
end

setup(ARGV)
run_tests()
