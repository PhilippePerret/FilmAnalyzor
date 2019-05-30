#!/usr/bin/env ruby

# Ce script permet de transformer les temps des events et des times
# depuis l'ancienne version où ils étaient enregistrés en valeurs relatives
# par rapport au début du film vers des valeurs absolues.
# L'idée est de recevoir en premier argument le path relatif d'une analyse
# dans le dossier des analyses et de corriger :
#   - events.json (event.time + balises {{time:...}})
#   - tous les documents (balises {{time:...}})

require 'json'

APPFOLDER = File.expand_path('.')
puts APPFOLDER
# exit 0

RPATH = 'her-copie'
# RPATH = ARGV[0]
ANALYSEPATH = File.join(APPFOLDER,'analyses',RPATH)

File.exists?(ANALYSEPATH) || raise("Le dossier #{ANALYSEPATH} n'existe pas.")

DATAPATH = File.join(ANALYSEPATH,'data.json')
File.exists?(DATAPATH) || raise("Impossible de procéder à l'opération dans le fichier data.json.")

EVENTSPATH = File.join(ANALYSEPATH,'events.json')
File.exists?(EVENTSPATH) || raise("Le fichier #{EVENTSPATH} est introuvable")

DATA = JSON.load(File.read(DATAPATH))
puts DATA
FILM_START_TIME = DATA["filmStartTime"]
puts "Temps de début du film défini : #{FILM_START_TIME}"

EVENTS = JSON.load(File.read(EVENTSPATH))
EVENTS.each do |ev|
  print ev["time"]
  ev["time"] = (ev["time"] + FILM_START_TIME).round(2)
  puts "-> #{ev["time"]}"
end
# puts "event: #{EVENTS}"

NEW_EVENTS_STRING = EVENTS.to_json
# puts NEW_EVENTS_STRING

REG_TAG_TIME = /\{\{time\:(.*?)\}\}/

def correct_balises_time_in str
  str.gsub(REG_TAG_TIME){
    var = $1
    print "var:#{var}"
    temps, horloge = var.split('|')
    print " (temps:#{temps}, horloge:#{horloge})"
    newTime = (temps.to_f + FILM_START_TIME).round(2)
    sup = horloge ? "|#{horloge}" : ""
    res = "{{time:#{newTime}#{sup}}}"
    puts " -> #{res}"
    res
  }
end


if NEW_EVENTS_STRING.match(REG_TAG_TIME)
  puts "*** Correction des balises {{time}} dans event.json"
  NEW_EVENTS_STRING = correct_balises_time_in(NEW_EVENTS_STRING)
end

NEW_EVENTSPATH = "#{EVENTSPATH}.corrected.json"
File.open(NEW_EVENTSPATH,'wb'){|f| f.write NEW_EVENTS_STRING}

FOLDER_ANALYSE_FILES = File.join(ANALYSEPATH,'analyse_files')
Dir["#{FOLDER_ANALYSE_FILES}/**/*.md"].each do |path|
  code = File.read(path).force_encoding('utf-8')
  next unless code.match(REG_TAG_TIME)
  new_path = "#{path}.corrected.md"
  File.open(new_path,'wb'){ |f| f.write correct_balises_time_in(code) }
  puts "= Correction du fichier -> #{File.basename(new_path)}"
end


puts "\n\n=== OPÉRATION TERMINÉE AVEC SUCCÈS ==="
