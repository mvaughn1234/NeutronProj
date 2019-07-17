require 'set'

# Important structures
# To be populated by setup
@mats = []
@energies = []
@lengths = []
@sizes = []
@each = false # True: Test each material at each energy and again at each length
@settings = [] # Will hold each test configuration (some mat, @ some energy, @ some length)
@set
@clean = false
@file_list = []

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
          if (num_decomp = en.match(/^(\d+\.?\d*)([x\*](\d+)\^(\d+)|[Ee](\d+))?([MKGmkg]?[Ee][Vv])?$/))
            val = num_decomp[1].to_f
            base = num_decomp[3]
            exp = num_decomp[4]
            exp2 = num_decomp[5]
            size = num_decomp[6]
            size_val = 10 ** -6
            if (size and scale = size.match(/(\w)?[Ee][Vv]/))
              if (scale[1] =~ /[Kk]/)
                size_val = 10 ** -3
              elsif scale[1] =~ /[Mm]/
                size_val = 1
              elsif scale[1] =~ /[Gg]/
                size_val = 10 ** 3
              end
            end
            if not base == nil
              base = base.to_i
              exp = exp.to_i
              val = val * (base ** exp) * size_val
            elsif not exp2 == nil
              exp2 = exp2.to_i
              val = val * (10 ** exp2) * size_val
            else
              val = val * size_val
            end
            @energies.push(val)
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
    if (m = flag.match(/^-?cl.*$/i))
      @clean = true
    end
  }
end

def gather_files(current_dir)
  Dir.entries(current_dir).each do |dir_entry|
    if File.directory?(current_dir+"/"+dir_entry) and not (dir_entry=~/^\.+/)
      gather_files(current_dir+"/"+dir_entry)
    elsif (m = dir_entry=~/(.+)\.csv$/)
      @file_list.push(current_dir+"/"+dir_entry)
    end
  end
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

def run_plots1()
  i = 0
  puts @settings
  make_dir(@plots_dir)
  for setting in @settings
    if i == 0
      fork do
        file_name = setting[:material]+"_"+setting[:length].to_s+"cm_Ene_"+
            setting[:energy].to_f.floor().to_s+".csv"
        file_path = @result_dir+setting[:material].to_s+"/"+
            setting[:length].to_s+"/"+setting[:material]+"_"+setting[:length].to_s+"cm_Ene_"+
            setting[:energy].to_f.floor().to_s+".csv"
        exec("python "+@py_dir+"plotter.py "+file_path+" "+@plots_dir+file_name+".png")
      end
    end
    i = i + 1
  end
end

def run_plots2(file_list)
  make_dir(@plots_dir)
  file_list.each do |file|
    m = file =~ /.+\/(.*)\.csv/
    name = $1
    fork do
      exec("python "+@py_dir+"plotter.py "+file+" "+@plots_dir+name+".png")
    end
  end
end

if(ARGV.length==0)
  gather_files(@result_dir)
  puts @file_list
  run_plots2(@file_list)
else
  setup(ARGV)
  if validate() == -1
    puts "invalid input"
    return
  end
  if create_test_cases() == -1
    puts "couldn't create test cases"
    return
  end
  run_plots1()
end