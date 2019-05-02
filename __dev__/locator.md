# Le Locator

Le locateur est l'outil, l'objet, la classe qui permet de situer la position dans le film, en suivant les évènements proches de lui. Par exemple, dans les `events` de `FAnalyse`, il tient à jour un index qui correspond à l'évènement courant en fonction du temps.

En général, il y a seulement un locateur en route, mais on peut imaginer en avoir plusieurs lorsqu'on suit deux endroits dans le film.

On pourrait dire aussi que le locateur est l'interface entre la vidéo-controller (instance `VideoController`) et l'analyse courante (instance `FAnalyse`).

### Réflexion

Si j'ai une liste avec :
    {
      time: [index-event, index-event, ...],
      time: [index-event, index-event, ...],
      ...
    }

C'est plus simple de retrouver un temps, surtout si les évènements sont rassemblés par 5 secondes. Donc le `time` ci-dessus irait de 5 secondes en 5 secondes.

Si le temps est de `0:20:12`, on cherche les évènements dans la tranche `0:20:10`

Donc :

    t - (t % 5)
