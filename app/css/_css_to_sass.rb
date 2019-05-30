#!/usr/bin/env ruby

PATH = ARGV[0]

puts "PATH: #{PATH}"

if !PATH || File.exists?(PATH)
  puts "Fichier non défini ou inexistant."
  exit 1
end

CURRENT_FOLDER = File.expand_path(File.dirname(__FILE__))
FINAL_PATH = File.expand_path(File.join(CURRENT_FOLDER, PATH))
FILE_AFFIXE = File.basename(PATH, File.extname(PATH))
FINAL_DEST = File.expand_path(File.join(CURRENT_FOLDER, '_sass_in_all', "_#{FILE_AFFIXE}.sass"))

# code = <<CSS
# /* Un commentaire pour voir */
# : pour voir :hover :12px
# {
#
# }
# valeur; /* un commentaire au bout */
#
#
# CSS

code = File.read(FINAL_PATH).force_encoding('utf-8')

# On retire les commentaires
reg = /\/\*(.*?)\*\//
code = code.gsub(reg,'//\1')

reg = /\/\*(.*?)\*\//m
code = code.gsub(reg){
  all = $1
  "//" + all.split("\n").join("\n// ")
}

# Espaces manquantes avant ":"
reg = /:([^ ])/
code = code.gsub(reg, ': \1')

# Rectifier certaine correction
reg = /: (nth|hover|active|not|focus|before|after)/
code = code.gsub(reg, ':\1')

# Points virgules à la fin
reg = /[\{\};]/
code = code.gsub(reg,'')

if ARGV[1] == '--write'
  File.open(FINAL_DEST,'wb'){|f| f.write code}
  puts "Il faut penser à ajouter << @import \"_sass_in_all/#{FILE_AFFIXE}\" >> au fichier 'a_index.sass"
else
  puts code
  puts "Pour enregistrer vraiment ce code dans le dossier '_sass_in_all' ajouter --write à la fin de la commande"

end
