require 'set'
require 'bigdecimal'
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
@allowed_mats = ["molybdinum","moly","bh303","beryllium","graphite","tin"]
@allowed_energies = [] # Check to make sure the input energy is valid
@length_min,@length_max = 1,100 # Min/max lengths (cm)

# For relocating data
@scripts_dir = "./../"
@rb_dir = @scripts_dir+"./rb_scripts/"
@py_dir = @scripts_dir+"./py_scripts/"
@output_dir = @scripts_dir+"./../build/" # Where geant puts .root & .ascii files
@result_dir = @scripts_dir+"./../results/" # Where data is sorted to
@plots_dir = @result_dir+"./plots/"
@temp_num = 0

def logspace(a, b, n)
  (0...n).map do |i|
    t = BigDecimal(i) / (n-1)
    10**( (1-t)*a + t*b )
  end
end

def setup(input)
  input.each {|flag|
    if (m = flag.match(/^-?[Mm][Aa][Tt].*=(.+)$/))
      if (m2 = m[1].match(/^((\w+,)*(\w+))$/))
        for mat in m2[1].split(",")
          @mats.push(mat)
        end
      end
    end
    if (m = flag.match(/^-?[Ee].*=(.+)$/))
      if (m2 = m[1].match(/^(([^,]+,)*([^,]+))$/))
        for en in m2[1].split(",")
          if (num_decomp = en.match(/^((\d+\.?\d*)([x\*](\d+)\^(\d+)|[Ee](\d+))?([MKGmkg]?[Ee][Vv])?)-?((\d+\.?\d*)([x\*](\d+)\^(\d+)|[Ee](\d+))?([MKGmkg]?[Ee][Vv])?)?$/))
            val = [BigDecimal(num_decomp[2]),BigDecimal(num_decomp[9])]
            base = [num_decomp[4],num_decomp[11]]
            exp = [num_decomp[5],num_decomp[12]]
            exp2 = [num_decomp[6],num_decomp[13]]
            size = [num_decomp[7],num_decomp[14]]
            size_val = BigDecimal("10") ** BigDecimal("-6")
            puts "val: " + val.to_s
            @erange = num_decomp[9].nil? ? false : true
            rng = @erange ? [0,1] : [0]
            for i in rng
              if (size[i] and scale = size[i].match(/(\w)?[Ee][Vv]/))
                if (scale[1] =~ /[Kk]/)
                  size_val = BigDecimal("10") ** BigDecimal("-3")
                elsif scale[1] =~ /[Mm]/
                  size_val = BigDecimal("1")
                elsif scale[1] =~ /[Gg]/
                  size_val = BigDecimal("10") ** BigDecimal("3")
                end
              end
              if not base[i] == nil
                base[i] = base[i].to_i
                exp[i] = exp[i].to_i
                val[i] = val[i] * (base[i] ** exp[i]) * size_val
              elsif not exp2[i] == nil
                exp2[i] = exp2[i].to_i
                val[i] = val[i] * (10 ** exp2[i]) * size_val
              else
                val[i] = val[i] * size_val
              end
              size_val = BigDecimal("10") ** BigDecimal("-6")
            end
            puts "val2: " + val.to_s
            if @erange
              logspace(Math::log(val[0],10),Math::log(val[1],10),30).each{|e_val| @energies.push(e_val.to_f)}
            else
              @energies.push(val[0].to_f)
            end
            puts @energies
          end
        end
      end
    end
    if (m = flag.match(/^-?[Ll][Ee][Nn].*=(.*)$/))
      if (m2 = m[1].match(/^(([^,]+,)*([^,]+))$/))
        for len in m2[1].split(",")
          if (len_decomp = len.match(/^(\d+\.?\d*)(\w+)$/))
            val = len_decomp[1].to_f
            size = len_decomp[2]
            if (size)
              if size =~ /^(in|inches|")$/i
                val /= 2.54
              elsif size =~ /^(m|meters)$/i
                val *= 100
              elsif size =~ /^(ft|feet|')$/i
                val /= 2.54 * 12
              elsif size =~ /^(mm|milimeters|mili)$/i
                val /= 10
              end
            end
            @lengths.push(val.to_i)
          end
        end
      end
    end
    if (m = flag.match(/^-?(all.*|each.*)$/i))
      @each = true
      end
    if (m = flag.match(/^-?(together)$/i))
      @together = true
    end
    if (m = flag.match(/^-?cl.*$/i))
      @clean = true
    end
    if (m = flag.match(/^-?(count.*|cnt.*)=(\d+)$/i))
      @process_counter = $2.to_i
    end
  }
end

def validate()
  # Validate Settings:
  for mat in @mats
    if not @allowed_mats.include? mat.downcase
      puts "unregistered material: " + mat
      return -1
    end
  end
  for len in @lengths
    if len > @length_max
      puts "material section too large: " + len.to_s + "(cm)"
      return -1
    elsif len < @length_min
      puts "material section too short: " + len.to_s + "(cm)"
      return -1
    end
  end

  @energies.map! do |en|
    en.to_s =~/(\d+).?(\d+)*/
    en = $2.nil? ? $1.to_s : $1.to_s+"_"+$2.to_s
    en
  end
  puts "energies modified: " + @energies.to_s
  @lengths.map!{|len| len.to_s}
  # for en in @energies
  #   if not @allowed_energies.include? en
  #     puts "Energy given ("+en.to_s+"MeV) not part of allowed discrete set of energies."
  #     return -1
  #   end
  # end

  # Validate correctness of setting quantities.
  @sizes = [@mats.size(),@energies.size(),@lengths.size()]
  if not @each
    @set = @sizes.to_set
    if (@set.size() == 3)
      puts "Cannot determine how to run " +@mats.size().to_s+" materials at " +@energies.size().to_s+
          " energies and for "+@lengths.size().to_s+" different lengths without mixing each setting."
      return -1
    end
  end
end

def create_test_cases()
  if @each
    for mat in @mats
      for len in @lengths
        for en in @energies
          @settings.push({:material => mat, :energy => en, :length => len})
        end
      end
    end
  else
    for i in 0..@sizes.max-1
      m = @sizes[0] > 1 ? @mats[i] : @mats[0]
      e = @sizes[1] > 1 ? @energies[i] : @energies[0]
      l = @sizes[2] > 1 ? @lengths[i] : @lengths[0]
      @settings.push({:material=> m, :energy => e, :length => l})
    end
  end
end

# Create directory for result (if doesn't exist)
def make_dir(output_path)
  constructed_dir = ""
  i = 0

  folders = output_path.split("/")
  folders.each{|subdir|
    if(i == 0)
      constructed_dir = subdir
    else
      constructed_dir = constructed_dir + "/" + subdir
    end
    i += 1
    if not (Dir.exist? constructed_dir)
      puts("Constructed dir: "+constructed_dir)
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
  file_name = test_case[:material]+"_"+test_case[:length]+"cm*"
  path_original = "./"+file_name
  path_final = @result_dir+test_case[:material]+"/"+test_case[:length]
  relocate_cmd = "find ./ -name '" +file_name+"' -exec mv '{}' '"+path_final+"/' ';'"
  make_dir(path_final)
  system(relocate_cmd)
  # if Dir.exists? @output_dir
  #   puts "original path: #{path_original}"
  #   if File.exists? path_original
  #   end
  # end
end

def copy_and_edit(test_case)
  runmac_path = @output_dir+"run1.mac"
  temp_name = rand(99999999).to_s
  @temp_num = temp_name
  edited = temp_name+"_edited.mac"
  log = temp_name+"_log.out"
  output_file_name = test_case[:material]+"_"+test_case[:length]+"cm_Ene_"+test_case[:energy]+"_MeV"
  if File.exist?(runmac_path)
    temp_name = @output_dir+temp_name+".mac"
    edited = @output_dir+edited
    log = @output_dir+log
    cmd = "cp "+runmac_path+" "+temp_name
    system(cmd)
  else
    puts "No run.mac found in "+@output_dir
    return
  end
  dest = File.new(edited,"w+")
  File.foreach(temp_name) do |line|
    if line =~ /^\/testhadr\/det\/setRadius1 \d+ cm$/
      line = "/testhadr/det/setRadius1 "+test_case[:length]+" cm\n"
    elsif line =~ /^\/testhadr\/det\/setMat1 \w+$/
      line = "/testhadr/det/setMat1 "+test_case[:material]+"\n"
    elsif line =~ /\/gun\/energy \d+.\d+ \weV/
      m = test_case[:energy] =~ /(\d+)_?(\d+)*/
      en = $2.empty? ? $1.to_s : $1.to_s+"."+$2.to_s
      line = "/gun/energy "+en+" MeV\n"
    elsif line =~ /^\/analysis\/setFileName .*\.(\w+)$/
      line = "/analysis/setFileName "+output_file_name+"."+$1+"\n"
    end
    dest.write(line)
  end
  dest.close()
  return edited,log
end

def clean()
  system("rm " +@output_dir+@temp_num.to_s+"*")
end

# Run geant for each setting on separate process
def run_tests()
  puts @settings
  Signal.trap("CLD") {@process_counter += 1}
  for setting in @settings
    Process.wait if @process_counter <= 0
    @process_counter -= 1
    fork do
      temp_name,log = copy_and_edit(setting)
      puts "Running: " + setting[:material] +" " + setting[:length] + "cm " + setting[:energy]+"MeV"
      system(@output_dir+"Hadr06 "+temp_name+" > "+log)
      relocate(setting)
      clean()
    end
  end
end

setup(ARGV)
if validate() == -1
  puts "invalid input"
  return
end
if create_test_cases() == -1
  puts "couldn't create test cases"
  return
end
run_tests()