'use strict'
/**

  Définition des données des events
  ---------------------------------
  Elles servent par exemple pour la boite des boutons
  de création des events.

**/

const EVENTS_TYPES_DATA = {}
EVENTS_TYPES_DATA[STRnote] = {
  type: STRnote
, id:   STRnote
, hname: 'Note'
, btn_name: 'Note'
, shortcut: 'n'
, genre: 'F'
, article:{
    indefini: {sing: 'une', plur: 'des'}
  , defini:   {sing: 'la', plur: 'les'}
  }
, name: {
    plain: {
      cap: {sing: 'Note', plur: 'Notes'}
    , min: {sing: STRnote, plur: 'notes'}
    , maj: {sing: 'NOTE', plur: 'NOTES'}
    }
  , short:{
      cap: {sing: 'Note', plur: 'Notes'}
    , min: {sing: STRnote, plur: 'notes'}
    , maj: {sing: 'NOTE', plur: 'NOTES'}
    }
  , tiny: {
      cap: {sing: 'Note', plur: 'Notes'}
    , min: {sing: STRnote, plur: 'notes'}
    , maj: {sing: 'NOTE', plur: 'NOTES'}
    }
  }
}

EVENTS_TYPES_DATA[STRinfo] = {
  type: STRinfo
, id:   STRinfo
, hname: 'Information'
, btn_name: 'Info'
, shortcut: 'f'
, genre: 'F'
, article:{
    indefini: {sing: 'une', plur: 'des'}
  , defini: {sing: 'l’', plur: 'les'}
  }
, name: {
    plain: {
      cap: {sing: 'Information', plur: 'Informations'}
    , min: {sing: 'information', plur: 'informations'}
    , maj: {sing: 'INFORMATION', plur: 'INFORMATIONS'}
    }
  , short:{
      cap: {sing: 'Info', plur: 'Infos'}
    , min: {sing: STRinfo, plur: 'infos'}
    , maj: {sing: 'IDÉE', plur: 'IDÉES'}
    }
  , tiny: {
      cap: {sing: 'Info', plur: 'Infos'}
    , min: {sing: STRinfo, plur: 'infos'}
    }
  }
}

EVENTS_TYPES_DATA[STRproc] = {
  type: STRproc
, id:   STRproc
, hname: 'Procédé'
, btn_name: 'Proc.'
, shortcut: 'p'
, genre: 'M'
, article:{
    indefini: {sing: 'un', plur: 'des'}
  , defini: {sing: 'le', plur: 'les'}
  }
, name: {
    plain: {
      cap: {sing: 'Procédé', plur: 'Procédés'}
    , min: {sing: 'procédé', plur: 'procédés'}
    , maj: {sing: 'PROCÉDÉ', plur: 'PROCÉDÉS'}
    }
  , short:{
      cap: {sing: 'Procédé', plur: 'Procédés'}
    , min: {sing: 'procédé', plur: 'procédés'}
    , maj: {sing: 'PROCÉDÉ', plur: 'PROCÉDÉS'}
    }
  , tiny: {
      cap: {sing: 'Proc', plur: 'Procs'}
    , min: {sing: STRproc, plur: 'procs'}
    }
  }
}


EVENTS_TYPES_DATA[STRscene] = {
  type: STRscene
, id:   STRscene
, hname: 'Scène'
, btn_name: 'Scène'
, shortcut: 's'
, genre: 'F'
, article:{
    indefini: {sing: 'une', plur: 'des'}
  , defini:   {sing: 'la', plur: 'les'}
  }
, name: {
    plain: {
      cap: {sing: 'Scène', plur: 'Scènes'}
    , min: {sing: 'scène', plur: 'scènes'}
    , maj: {sing: 'SCÈNE', plur: 'SCÈNES'}
    }
  , short:{
      cap: {sing: 'Scène', plur: 'Scènes'}
    , min: {sing: 'scène', plur: 'scènes'}
    , maj: {sing: 'SCÈNE', plur: 'SCÈNES'}
    }
  , tiny: {
      cap: {sing: 'Sc.', plur: 'Sc.'}
    , min: {sing: 'sc.', plur: 'sc.'}
    , maj: {sing: 'SC.', plur: 'SC.'}
    }
  }
}


EVENTS_TYPES_DATA[STRaction] = {
    type: STRaction
  , id:   STRaction
  , hname: 'Action'
  , shortcut: 'a'
  , genre: 'F'
  , article:{
      indefini: {sing: 'une', plur: 'des'}
    , defini: {sing: 'l’', plur: 'les'}
    }
  , name: {
      plain: {
        cap: {sing: 'Action', plur: 'Actions'}
      , min: {sing: STRaction, plur: 'actions'}
      , maj: {sing: 'ACTION', plur: 'ACTIONS'}
      }
    , short:{
        cap: {sing: 'Action', plur: 'Actions'}
      , min: {sing: STRaction, plur: 'actions'}
      , maj: {sing: 'ACTION', plur: 'ACTIONS'}
      }
    , tiny: {
        cap: {sing: 'Act.', plur: 'Acts.'}
      , min: {sing: 'act.', plur: 'acts.'}
      }
    }
  }

EVENTS_TYPES_DATA[STRdialog] = {
  type: STRdialog
, id:   STRdialog
, hname: 'Dialogue'
, btn_name: 'Dial.'
, shortcut: 'd'
, genre: 'M'
, article:{
    indefini: {sing: 'un', plur: 'des'}
  , defini: {sing: 'le', plur: 'les'}
  }
, name: {
    plain: {
      cap: {sing: 'Dialogue', plur: 'Dialogues'}
    , min: {sing: 'dialogue', plur: 'dialogues'}
    , maj: {sing: 'DIALOGUE', plur: 'DIALOGUES'}
    }
  , short:{
      cap: {sing: 'Dial.', plur: 'Dials'}
    , min: {sing: 'dial.', plur: 'dials'}
    , maj: {sing: 'DIAL.', plur: 'DIALS'}
    }
  , tiny: {
      cap: {sing: 'Dial.', plur: 'Dials.'}
    , min: {sing: 'dial.', plur: 'dials.'}
    }
  }
}

EVENTS_TYPES_DATA[STRdyna] = {
  type: STRdyna
, id:   STRdyna
, hname: 'Objectif-Obstacle-Conflit'
, btn_name: 'O.O.C.'
, shortcut: 'o'
, genre: 'M'
, article:{
    indefini: {sing: 'un', plur: 'des'}
  , defini: {sing: 'l’', plur: 'les'}
  }
, name: {
    plain: {
      cap: {sing: 'Élément dynamique', plur: 'Éléments dynamiques'}
    , min: {sing: 'élément dynamique', plur: 'éléments dynamiques'}
    }
  , short:{
      cap: {sing: 'El. dynamique', plur: 'Els. dynamiques'}
    , min: {sing: 'el. dynamique', plur: 'els. dynamiques'}
    , maj: {sing: 'EL. DYNAMIQUE', plur: 'ELS. DYNAMIQUES'}
    }
  , tiny: {
      cap: {sing: 'El.Dyn', plur: 'Els.Dyn'}
    , min: {sing: 'el.dyn', plur: 'els.dyn'}
    }
  }
}


EVENTS_TYPES_DATA[STRevent] = {
  type: STRevent
, id:   STRevent
, hname: 'Event'
, btn_name: 'Event'
, shortcut: 'e'
, genre: 'M'
, article:{
    indefini: {sing: 'un', plur: 'des'}
  , defini: {sing: 'l’', plur: 'les'}
  }
, name: {
    plain: {
      cap: {sing: 'Évènement', plur: 'Évènements'}
    , min: {sing: 'évènement', plur: 'évènements'}
    , maj: {sing: 'ÉVÈNEMENT', plur: 'ÉVÈNEMENTS'}
    }
  , short:{
      cap: {sing: 'Évènement', plur: 'Évènements'}
    , min: {sing: 'évènement', plur: 'évènements'}
    , maj: {sing: 'ÉVÈNEMENT', plur: 'ÉVÈNEMENTS'}
    }
  , tiny: {
      cap: {sing: 'Ev.', plur: 'Evs.'}
    , min: {sing: 'ev.', plur: 'evs.'}
    }
  }
}

EVENTS_TYPES_DATA[STRidee] = {
  type: STRidee
, id:   STRidee
, hname: 'Idée'
, btn_name: 'Idée'
, shortcut: 'i'
, genre: 'F'
, article:{
    indefini: {sing: 'une', plur: 'des'}
  , defini: {sing: 'l’', plur: 'les'}
  }
, name: {
    plain: {
      cap: {sing: 'Idée', plur: 'Idées'}
    , min: {sing: 'idée', plur: 'idées'}
    , maj: {sing: 'IDÉE', plur: 'IDÉES'}
    }
  , short:{
      cap: {sing: 'Action', plur: 'Idées'}
    , min: {sing: 'idée', plur: 'idées'}
    , maj: {sing: 'IDÉE', plur: 'IDÉES'}
    }
  , tiny: {
      cap: {sing: 'Idée', plur: 'Idées'}
    , min: {sing: 'idée', plur: 'idées'}
    }
  }
}

EVENTS_TYPES_DATA[STRqrd] = {
  type: STRqrd
, id:   STRqrd
, hname: 'Question/Réponse Dramatique'
, btn_name: 'QRD'
, shortcut: 'q'
, genre: 'F'
, article:{
    indefini: {sing: 'une', plur: 'des'}
  , defini: {sing: 'la', plur: 'les'}
  }
, name: {
    plain: {
      cap: {sing: 'Question/réponse dramatique', plur: 'Questions/réponses dramatiques'}
    , min: {sing: 'question/réponse dramatique', plur: 'questions/réponses dramatiques'}
    , maj: {sing: 'QUESTION/RÉPONSE DRAMATIQUE', plur: 'QUESTIONS/RÉPONSES DRAMATIQUES'}
    }
  , short:{
      cap: {sing: 'Q/R Dramatique', plur: 'Q/R Dramatiques'}
    , min: {sing: 'q/r dramatique', plur: 'q/r dramatiques'}
    , maj: {sing: 'Q/R DRAMATIQUE', plur: 'Q/R DRAMATIQUES'}
    }
  , tiny: {
      cap: {sing: 'QRD', plur: 'QRDs'}
    , min: {sing: STRqrd, plur: 'qrds'}
    }
  }
}

EVENTS_TYPES_DATA[STRstt] = {
  type: STRstt
, id:   STRstt
, hname: 'Nœud Structure'
, btn_name: 'Nœud STT'
, shortcut: 't'
, genre: 'M'
, article:{
    indefini: {sing: 'un', plur: 'des'}
  , defini: {sing: 'le', plur: 'les'}
  }
, name: {
    plain: {
      cap: {sing: 'Nœud structurel', plur: 'Nœud structurels'}
    , min: {sing: 'nœud structurel', plur: 'nœud structurels'}
    , maj: {sing: 'NŒUD STRUCTUREL', plur: 'NŒUDS STRUCTURELS'}
    }
  , short:{
      cap: {sing: 'Nœud Stt', plur: 'Nœuds Stt'}
    , min: {sing: 'Nœud Stt', plur: 'Nœuds Stt'}
    , maj: {sing: 'Nœud STT', plur: 'Nœuds STT'}
    }
  , tiny: {
      cap: {sing: 'N.Stt', plur: 'N.Stt'}
    , min: {sing: 'n.stt', plur: 'n.stt'}
    , maj: {sing: 'N.STT', plur: 'N.STT'}
    }
  }
}

module.exports = EVENTS_TYPES_DATA
