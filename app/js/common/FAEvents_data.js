'use strict'
/**

  Définition des données des events
  ---------------------------------
  Elles servent par exemple pour la boite des boutons
  de création des events.

**/

const EVENTS_DATA = {
  scene:  {id: STRscene,   hname: 'Scène', btn_name: 'Scène'}
, stt:    {id: STRstt,     hname: 'Nœud structurel', btn_name: 'N.STT'}
, dyna:   {id: STRdyna,    hname: 'Élément dynamique', btn_name: 'O.O.C.'}
, proc:   {id: STRproc,    hname: 'Procédé', btn_name: 'Proc.'}
, note:   {id: STRnote,    hname: 'Note', btn_name: 'Note'}
, idee:   {id: STRidee,    hname: 'Idée', btn_name: 'Idée'}
, info:   {id: STRinfo,    hname: 'Info', btn_name: 'Info'}
, qrd:    {id: STRqrd,     hname: 'Question/Réponse Dramatique', btn_name: 'QRD'}
, action: {id: STRaction,  hname: 'Action', btn_name: 'Action'}
, dialog: {id: STRdialog,  hname: 'Dialogue', btn_name: 'Dial.'}
, event:  {id: STRevent,   hname: 'Évènement', btn_name: 'Ev.'}
}

const EVENTS_TYPES_DATA = {}
EVENTS_TYPES_DATA[STRnote] = {
  type: STRnote
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
EVENTS_TYPES_DATA[STRaction] = {
    type: STRaction
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

EVENTS_TYPES_DATA[STRinfo] = {
      type: STRinfo
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

EVENTS_TYPES_DATA[STRqrd] = {
      type: STRqrd
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

EVENTS_TYPES_DATA[STRscene] = {
      type: STRscene
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

EVENTS_TYPES_DATA[STRstt] = {
      type: STRstt
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
