#!/usr/bin/env ruby

FIT_FOLDER = File.expand_path('./FITests')
RC = "
"
# puts "FIT_FOLDER: #{FIT_FOLDER}"
# Pour traiter un paramètre de méthode, soit entrant soit sortant
class MParam
  def initialize name, line
    @name = name
    @line = line
    if @line.match(/^\{(.*?)\}/)
      # Quand le premier mot et le type de la donnée
      idx = @line.index('}')
      @type = @line[1..idx - 1].strip
      @description = (@line[idx+1..-1]||'').strip
    else
      @description = @line
    end
  end
  def name ; @name end
  def type ; @type || 'None' end
  def description ; @description end
  def html
    "<div class=\"param\"><span class=\"param-name\">#{name}</span><span class=\"param-type\">#{type}</span><span class=\"param-description\">#{description}</span></div>"
  end
end

# Pour traiter une méthode
class TestMethod

  def initialize lines
    @lines = lines
  end
  # Méthode pour écrire la méthode dans le fichier
  def write
    analyze
    # puts @data
    aidefile.add html
  end
  # Retourne le code HTML à écrire
  def html
    note = @data[:note] ? "<div class=\"method-note\">#{@data[:note]}</div>" : ''
    block_provided = @data[:provided].empty? ? '' : <<-HTML
    <div class="method-provided">#{
      @data[:provided].collect do |param|
        param.html
      end.join
    }</div>
    HTML

    block_returned = @data[:returned].empty? ? '' : <<-HTML
    <div class="method-returned">#{
      @data[:returned].collect do |param|
        param.html
      end.join
    }</div>
    </div>
    HTML

    block_usage = @data[:usage].nil? ? '' : <<-HTML
    <div class="method-usage"><span class="usage">#{@data[:usage]}</span></div>
    HTML

    <<-EOF
<div class="method">
  <div class="method-name">#{@data[:method]}</div>
  <div class="method-description">#{@data[:description]}</div>
  #{block_provided}
  #{block_returned}
  #{block_usage}
  #{note}
    EOF
  end
  def analyze
    @data = {
      :method => nil, :description => nil, :note => nil,
      :usage => nil,
      :provided => [], :returned => []
    }
    current_rubrique = nil
    @lines.each do |line|
      line = line.strip
      line.empty? && next
      dline = line.split(' ')
      first_mot = dline.shift.strip
      rest_line = dline.join(' ').strip || ''

      if line.start_with?('@')
        rubrique = first_mot[1..-1]
        case rubrique
        when 'method'       then @data[:method]       = rest_line
        when 'description'  then @data[:description]  = rest_line
        when 'note'         then @data[:note]         = rest_line
        when 'usage'        then @data[:usage]        = rest_line
        end
        current_rubrique = rubrique.to_sym
      elsif line.start_with?(':')
        property = first_mot[1..-1]
        # puts "current_rubrique: #{current_rubrique}"
        @data[current_rubrique] << MParam.new(property, rest_line)
      end
    end
  end

end

class MethodFile
  def initialize path
    @path = path
  end
  def treate
    puts "Traitement de #{@path}"
    puts "Nombre de lignes : #{lines.count}"
    lines_new_method = nil
    lines.each do |line|
      line = line.strip
      if line.start_with?('@method')
        lines_new_method = [line]
      elsif lines_new_method && line == '*/'
        # puts "Une nouvelle méthode doit être créée avec #{lines_new_method}"
        imethod = TestMethod.new(lines_new_method)
        imethod.write
        lines_new_method = nil
      elsif lines_new_method
        lines_new_method.push(line)
      end
    end
  end
  def lines
    @lines ||= content.split(RC)
  end
  def content
    @content ||= File.read(@path).force_encoding('utf-8')
  end
end

class AideFile
  def path
    @path ||= File.join(FIT_FOLDER,'Manuel','Manuel_FITests_METHS.html')
  end
  def init
    File.unlink(path) if File.exists?(path)
    @tdm = []
    add <<-HTML
  <!DOCTYPE html>
  <html lang="fr" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title>FITests Methodes et Expectations</title>
      <link rel="stylesheet" href="./Manuel_FITests.css">
    </head>
    <body>
      <section id="tdm">
        ___TDM___
      </section>
    HTML
  end
  def addFile path
    ancre = path.gsub(/[^a-z]/i,'')
    name  = File.basename(path,File.extname(path))
    add "<div id=\"#{ancre}\" class=\"file\"><span class=\"name\">#{name}</span><span class=\"path\">#{path}</span></div>"
    addTdm(path, name, ancre)
  end
  def addTdm path, name, ancre
    name = "#{name[0].upcase}#{name[1..-1].downcase}"
    @tdm << "<a href=\"##{ancre}\">#{name}</a>"
  end
  def add str
    rf.write(str)
  end
  def close
    add "\n</body>\n</html>"
    rf.close
    insertTdm
  end
  def insertTdm
    code = File.read(path).force_encoding('utf-8')
    code.sub!(/___TDM___/, @tdm.join)
    File.open(path,'wb'){|f| f.write(code)}
  end
  def rf
    @rf ||= File.open(path,'a')
  end
end

def aidefile
  @aidefile ||= AideFile.new()
end

# Initialisation du fichier qui va contenir toutes les méthodes
aidefile.init

begin
  Dir["#{FIT_FOLDER}/**/*.js"].each do |path|
    File.read(path).match(/\@method/) || next
    aidefile.addFile(path)
    mfile = MethodFile.new(path)
    mfile.treate
  end

rescue Exception => e
  puts "ERROR: #{e}"
  puts e.backtrace
ensure
  aidefile.close
end
